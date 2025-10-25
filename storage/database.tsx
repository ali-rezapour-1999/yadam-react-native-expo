import * as SQLite from 'expo-sqlite';
import { TaskStatus } from '@/constants/enums/TaskEnum';
import { Task, TaskWithCategory, Topic, TopicWithCount } from '@/types/database-type';

export class UnifiedDatabase {
  private static instance: UnifiedDatabase;
  private db: SQLite.SQLiteDatabase;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    this.db = SQLite.openDatabaseSync('app.db');
  }

  public static getInstance(): UnifiedDatabase {
    if (!UnifiedDatabase.instance) {
      UnifiedDatabase.instance = new UnifiedDatabase();
    }
    return UnifiedDatabase.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        await this.db.runAsync(`
          CREATE TABLE IF NOT EXISTS topics (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            is_public INTEGER NOT NULL DEFAULT 0,
            status TEXT DEFAULT NULL,
            category_id TEXT DEFAULT NULL,
            likes INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            user_id TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0
          );
        `);

        await this.db.runAsync(`
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING',
            reminder_days TEXT NOT NULL DEFAULT '[]',
            topic_id TEXT DEFAULT NULL,
            goal_id TEXT DEFAULT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            user_id TEXT NOT NULL,
            level TEXT not null DEFAULT 'low',
            is_deleted INTEGER NOT NULL DEFAULT 0

            CHECK (date LIKE '____-__-__'),
            CHECK (start_time LIKE '__:__'),
            CHECK (end_time LIKE '__:__'),
            CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
          );
        `);

        await this.db.runAsync('PRAGMA foreign_keys = ON;');
        await this.db.runAsync('PRAGMA journal_mode = WAL;');
        await this.db.runAsync('PRAGMA synchronous = NORMAL;');
        await this.db.runAsync('CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, date);');

        console.warn('[Database] Unified database initialized successfully');
        this.isInitialized = true;
        this.initializationPromise = null;
      } catch (error) {
        this.initializationPromise = null;
        console.error('Unified database initialization failed:', error);
        throw new Error(`Failed to initialize database: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    })();

    return this.initializationPromise;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  private topicToRow(topic: Topic) {
    return {
      id: topic.id,
      title: topic.title.trim(),
      description: topic.description?.trim() || '',
      is_public: topic.isPublic ? 1 : 0,
      status: topic.status ?? null,
      category_id: topic.categoryId ?? null,
      likes: topic.likes ?? 0,
      created_at: topic.createdAt,
      updated_at: topic.updatedAt,
      user_id: topic.userId,
      is_deleted: topic.isDeleted ? 1 : 0,
    };
  }

  private rowToTopic(row: any): Topic {
    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      isPublic: !!row.is_public,
      status: row.status || undefined,
      categoryId: row.category_id ?? undefined,
      likes: row.likes ?? 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userId: row.user_id,
      isDeleted: !!row.is_deleted,
    };
  }

  private rowToTopics(row: any): TopicWithCount {
    return {
      ...this.rowToTopic(row),
      tasksCount: row.tasks_count,
    };
  }

  private validateTopic(topic: Topic): void {
    if (!topic.id) throw new Error('Topic ID is required');
    if (!topic.title?.trim()) throw new Error('Topic title is required');
    if (!topic.userId) throw new Error('User ID is required');
  }

  public async createTopic(topic: Topic): Promise<void> {
    await this.ensureInitialized();
    this.validateTopic(topic);

    try {
      const row = this.topicToRow(topic);
      await this.db.runAsync(
        `
        INSERT OR REPLACE INTO topics (
          id, title, description, is_public, status, category_id, likes, created_at, updated_at, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.id, row.title, row.description, row.is_public, row.status, row.category_id, row.likes, row.created_at, row.updated_at, row.user_id],
      );
    } catch (error) {
      console.error(`Failed to create topic with ID ${topic.id}:`, error);
      throw new Error(`Failed to create topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async updateTopic(topic: Topic): Promise<void> {
    await this.ensureInitialized();
    this.validateTopic(topic);

    try {
      const row = this.topicToRow(topic);
      const result = await this.db.runAsync(
        `
        UPDATE topics SET
          title = ?, description = ?, is_public = ?, status = ?, category_id = ?, likes = ?, updated_at = ? , is_deleted = ?
         WHERE id = ?`,
        [row.title, row.description, row.is_public, row.status, row.category_id, row.likes, new Date().toISOString(), row.id, row.is_deleted],
      );

      if (result.changes === 0) {
        throw new Error(`Topic with ID ${topic.id} not found`);
      }
    } catch (error) {
      console.error(`Failed to update topic with ID ${topic.id}:`, error);
      throw new Error(`Failed to update topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async updateTopicAfterLogin(newId: string, lastId: string): Promise<void> {
    await this.ensureInitialized();

    try {
      const result = await this.db.runAsync(
        `
        UPDATE topics SET user_id = ?
         WHERE user_id = ?`,
        [newId, lastId],
      );

      if (result.changes === 0) {
        throw new Error(`Topic with ID ${lastId} not found`);
      }
    } catch (error) {
      console.error(`Failed to update topic with ID ${lastId}:`, error);
      throw new Error(`Failed to update topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getTopicById(id: string): Promise<Topic | null> {
    await this.ensureInitialized();
    if (!id) throw new Error('Topic ID is required');

    try {
      const row = await this.db.getFirstAsync('SELECT * FROM topics WHERE id = ?', [id]);
      return row ? this.rowToTopic(row) : null;
    } catch (error) {
      console.error(`Failed to get topic with ID ${id}:`, error);
      throw new Error(`Failed to get topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getUserTopics(userId: string): Promise<TopicWithCount[]> {
    await this.ensureInitialized();
    if (!userId) throw new Error('User ID is required');

    try {
      const rows = await this.db.getAllAsync<TopicWithCount>(
        `SELECT t.*, count(ta.id) as tasks_count
         FROM topics t
         LEFT JOIN tasks ta ON ta.topic_id = t.id AND ta.is_deleted = 0
         WHERE t.user_id = ? AND t.is_deleted = 0
         GROUP BY t.id`,
        [userId],
      );
      return rows.map((row) => this.rowToTopics(row));
    } catch (error) {
      console.error(`Failed to get topics for user ${userId}:`, error);
      throw new Error(`Failed to get topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  public async getAllUserTopicsByUserId(userId: string): Promise<Topic[]> {
    await this.ensureInitialized();
    if (!userId) throw new Error('User ID is required');

    try {
      const rows = await this.db.getAllAsync<TopicWithCount>(
        `SELECT t.* FROM topics t WHERE t.user_id = ?`,
        [userId],
      );
      return rows.map((row) => this.rowToTopics(row));
    } catch (error) {
      console.error(`Failed to get topics for user ${userId}:`, error);
      throw new Error(`Failed to get topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getAllPublicTopics(): Promise<Topic[]> {
    await this.ensureInitialized();

    try {
      const rows = await this.db.getAllAsync('SELECT * FROM topics WHERE is_public = 1 AND is_deleted = 0');
      return rows.map((row) => this.rowToTopic(row));
    } catch (error) {
      console.error('Failed to get public topics:', error);
      throw new Error(`Failed to get public topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async removeTopic(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!id) throw new Error('Topic ID is required');

    try {
      await this.db.runAsync('UPDATE tasks SET topic_id = NULL WHERE topic_id = ?', [id]);
      const result = await this.db.runAsync('Update topics SET is_deleted = 1 WHERE id = ?', [id]);

      if (result.changes === 0) {
        throw new Error(`Topic with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Failed to remove topic with ID ${id}:`, error);
      throw new Error(`Failed to remove topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async searchTopic(userId: string, search: string): Promise<TopicWithCount[]> {
    await this.ensureInitialized();
    if (!search) throw new Error('Search Topic is required');

    try {
      const rows = await this.db.getAllAsync<TopicWithCount>(
        `SELECT t.*, count(ta.id) as tasks_count
         FROM topics t
         LEFT JOIN tasks ta ON ta.topic_id = t.id and ta.is_deleted = 0
         WHERE t.user_id = ? And t.is_deleted = 0
         AND LOWER(t.title) LIKE '%' || LOWER(?) || '%'
         GROUP BY t.id`,
        [userId, search],
      );
      return rows.map((row) => this.rowToTopics(row));
    } catch (error) {
      console.error(`Failed to get topics for user ${userId}:`, error);
      throw new Error(`Failed to get topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private taskToRow(task: Task) {

    const safe = (v?: string) => (v && v.trim() ? v.trim() : null);
    return {
      id: task.id,
      title: task.title.trim(),
      description: task.description?.trim() || '',
      start_time: task.startTime,
      end_time: task.endTime,
      date: task.date,
      status: task.status,
      topic_id: safe(task.topicId),
      reminder_days: JSON.stringify(task.reminderDays || []),
      goal_id: safe(task.goalId),
      created_at: task.createdAt,
      updated_at: task.updatedAt,
      user_id: task.userId,
      is_deleted: task.isDeleted ? 1 : 0,
    };
  }

  private rowToTask(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      startTime: row.start_time,
      endTime: row.end_time,
      date: row.date,
      status: row.status as TaskStatus,
      reminderDays: JSON.parse(row.reminder_days ?? '[]'),
      topicId: row.topic_id ?? undefined,
      goalId: row.goal_id ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userId: row.user_id,
      isDeleted: !!row.is_deleted,
    };
  }

  private rowToTaskWithTopic(row: any): TaskWithCategory {
    return {
      ...this.rowToTask(row),
      topicsTitle: row.topic_title ?? undefined,
      topicsCategoryId: row.topic_category_id ?? undefined,
    };
  }

  private validateTask(task: Task): void {
    if (!task.id?.trim()) throw new Error('Task ID is required');
    if (!task.title?.trim()) throw new Error('Task title is required');
    if (!task.userId) throw new Error('User ID is required');
    if (!task.startTime?.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      throw new Error('Invalid start time format. Expected: HH:MM or HH:MM:SS');
    }
    if (!task.endTime?.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      throw new Error('Invalid end time format. Expected: HH:MM or HH:MM:SS');
    }
    if (!task.endTime?.match(/^\d{2}:\d{2}$/)) throw new Error('Invalid end time format. Expected: HH:MM');
    if (!['PENDING', 'CANCELLED', 'COMPLETED'].includes(task.status ?? '')) throw new Error('Invalid status value');
  }

  public async createTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    this.validateTask(task);

    try {
      const row = this.taskToRow(task);
      await this.db.runAsync(
        `
        INSERT OR REPLACE INTO tasks (
          id, title, description, start_time, end_time, date, status, 
          topic_id, goal_id, created_at, updated_at, reminder_days, user_id , is_deleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)`,
        [row.id, row.title, row.description, row.start_time, row.end_time, row.date, row.status, row.topic_id, row.goal_id, row.created_at, row.updated_at, row.reminder_days, row.user_id, row.is_deleted],
      );
    } catch (error) {
      console.error(`Failed to create task with ID ${task.id}:`, error);
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async updateTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    this.validateTask(task);

    try {
      const row = this.taskToRow(task);
      const result = await this.db.runAsync(
        `
        UPDATE tasks SET
          title = ?, description = ?, start_time = ?, end_time = ?, date = ?, 
          status = ?, topic_id = ?, goal_id = ?, updated_at = ? , is_deleted = ?
         WHERE id = ?`,
        [row.title, row.description, row.start_time, row.end_time, row.date, row.status, row.topic_id, row.goal_id, new Date().toISOString(), row.is_deleted, row.id]
      );

      if (result.changes === 0) {
        throw new Error(`Task with ID ${task.id} not found`);
      }
    } catch (error) {
      console.error(`Failed to update task with ID ${task.id}:`, error);
    }
  }

  public async getTaskById(id: string): Promise<Task | null> {
    await this.ensureInitialized();
    if (!id) throw new Error('Task ID is required');

    try {
      const row = await this.db.getFirstAsync(`
            SELECT t.*, c.title as topic_title, c.id as topic_category_id 
            FROM tasks t 
            LEFT JOIN topics c ON t.topic_id = c.id 
            WHERE t.id = ? AND (c.is_deleted = 0 OR c.id IS NULL)
          `, [id]);
      return row ? this.rowToTaskWithTopic(row) : null;
    } catch (error) {
      console.error(`Failed to get task with ID ${id}:`, error);
      throw new Error(`Failed to get task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getTasksByDateAndStatus(date: string, status?: TaskStatus): Promise<Task[]> {
    await this.ensureInitialized();
    if (!date?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error('Invalid date format. Expected: YYYY-MM-DD');
    }

    try {
      let query = `SELECT t.* , c.title as topic_title, c.category_id as topic_category_id FROM tasks t 
        LEFT JOIN topics c ON t.topic_id = c.id
        WHERE t.date = ? AND t.is_deleted = 0`;
      let params: any[] = [date];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      const rows = await this.db.getAllAsync(query, params);
      return rows.map((row) => this.rowToTaskWithTopic(row));
    } catch (error) {
      console.error(`Failed to get tasks for date ${date}:`, error);
      throw new Error(`Failed to get tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getTasksWithTopicByDate(date: string, topicId?: string): Promise<TaskWithCategory[]> {
    await this.ensureInitialized();
    if (!date?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error('Invalid date format. Expected: YYYY-MM-DD');
    }

    try {
      let query = `
        SELECT 
          tasks.*,
          topics.title AS topic_title,
          topics.description AS topic_description,
          topics.is_public AS topic_is_public,
          topics.status AS topic_status,
          topics.category_id AS topic_category_id
        FROM tasks
        LEFT JOIN topics ON tasks.topic_id = topics.id  
        WHERE tasks.date = ? AND tasks.is_deleted = 0 and topics.is_deleted = 0
      `;

      let params: any[] = [date];

      if (topicId) {
        query += ' AND tasks.topic_id = ?';
        params.push(topicId);
      }

      query += ' ORDER BY tasks.start_time ASC';

      const rows = await this.db.getAllAsync(query, params);
      return rows.map((row) => this.rowToTaskWithTopic(row));
    } catch (error) {
      console.error(`Failed to get tasks with topics for date ${date}:`, error);
      throw new Error(`Failed to get tasks with topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getTasksWithTopicId(topicId?: string): Promise<TaskWithCategory[]> {
    await this.ensureInitialized();

    try {
      let query = `
        SELECT 
          tasks.*,
          topics.title AS topic_title,
          topics.description AS topic_description,
          topics.is_public AS topic_is_public,
          topics.status AS topic_status,
          topics.category_id AS topic_category_id
        FROM tasks
        LEFT JOIN topics ON tasks.topic_id = topics.id  
        WHERE tasks.topic_id = ? and tasks.is_deleted = 0 and topics.is_deleted = 0
      `;

      let params: any[] = [topicId];

      query += ' ORDER BY tasks.start_time ASC';

      const rows = await this.db.getAllAsync(query, params);
      return rows.map((row) => this.rowToTaskWithTopic(row));
    } catch (error) {
      console.error(`Failed to get tasks with topics for date ${topicId}:`, error);
      throw new Error(`Failed to get tasks with topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getUserTasks(userId: string, includeDeleted: boolean = false): Promise<Task[]> {
    await this.ensureInitialized();
    if (!userId) throw new Error('User ID is required');

    try {
      let query = 'SELECT * FROM tasks WHERE user_id = ?';
      const params: any[] = [userId];

      if (!includeDeleted) {
        query += ' AND is_deleted = 0';
      }

      query += ' ORDER BY created_at DESC';


      const rows = await this.db.getAllAsync(query, params);
      return rows.map((row) => this.rowToTask(row));
    } catch (error) {
      console.error(`Failed to get tasks for user ${userId}:`, error);
      throw new Error(`Failed to get user tasks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async removeTask(id: string): Promise<void> {
    await this.ensureInitialized();
    if (!id) throw new Error('Task ID is required');

    try {
      const result = await this.db.runAsync('Update tasks SET is_deleted = 1 WHERE id = ?', [id]);

      if (result.changes === 0) {
        throw new Error(`Task with ID ${id} not found`);
      }
    } catch (error) {
      console.error(`Failed to remove task with ID ${id}:`, error);
      throw new Error(`Failed to remove task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async migrateFromOldStructure(): Promise<void> {
    await this.ensureInitialized();

    try {
      const oldTables = (await this.db.getAllAsync(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN ('topics_old', 'tasks_old')
      `)) as { name: string }[];

      if (oldTables.length > 0) {
        console.warn('[Migration] Starting data migration...');

        try {
          const oldTopics = (await this.db.getAllAsync('SELECT * FROM topics_old')) as {
            id: string;
            title: string;
            description?: string;
            is_public: number;
            status?: string;
            likes: number;
            created_at: string;
            updated_at: string;
            user_id: string;
            is_delete: number;
          }[];

          for (const topic of oldTopics) {
            await this.db.runAsync(
              `
              INSERT OR REPLACE INTO topics (
                id, title, description, is_public, status, category_id, likes, created_at, updated_at, user_id , is_delete
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)`,
              [topic.id, topic.title, topic.description || '', topic.is_public || 0, topic.status || null, null, topic.likes || 0, topic.created_at, topic.updated_at, topic.user_id, topic.is_delete],
            );
          }
          console.warn(`[Migration] Migrated ${oldTopics.length} topics`);
        } catch (error) {
          console.warn('[Migration] Topics table might not exist or already migrated:', error);
        }

        console.warn('[Migration] Data migration completed');
      }
    } catch (error) {
      console.error('[Migration] Migration failed:', error);
      throw new Error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const unifiedDatabase = UnifiedDatabase.getInstance();

export const taskStorage = {
  createTask: (task: Task) => unifiedDatabase.createTask(task),
  updateTask: (task: Task) => unifiedDatabase.updateTask(task),
  getTaskById: (id: string) => unifiedDatabase.getTaskById(id),
  getAllTaskByUserId: (userId: string) => unifiedDatabase.getUserTasks(userId, true),
  loadTasksByDateStatus: (date: string, status?: TaskStatus) => unifiedDatabase.getTasksByDateAndStatus(date, status),
  loadTasksByDateTopic: (date: string, topicId?: string) => unifiedDatabase.getTasksWithTopicByDate(date, topicId),
  loadTasksByTopicId: (topicId?: string) => unifiedDatabase.getTasksWithTopicId(topicId),
  removeTask: (id: string) => unifiedDatabase.removeTask(id),
};

export const topicStorage = {
  createTopic: (topic: Topic) => unifiedDatabase.createTopic(topic),
  updateTopic: (topic: Topic) => unifiedDatabase.updateTopic(topic),
  getTopicById: (id: string) => unifiedDatabase.getTopicById(id),
  getAllPublicTopics: () => unifiedDatabase.getAllPublicTopics(),
  getUserTopics: (userId: string) => unifiedDatabase.getUserTopics(userId),
  getAllUserTopicsByUserId: (userId: string) => unifiedDatabase.getAllUserTopicsByUserId(userId),
  updateTopicAfterLogin: (newId: string, lastId: string) => unifiedDatabase.updateTopicAfterLogin(newId, lastId),
  removeTopic: (id: string) => unifiedDatabase.removeTopic(id),
  searchTopics: (userId: string, search: string) => unifiedDatabase.searchTopic(userId, search),
};
