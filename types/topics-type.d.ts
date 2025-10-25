import { Topic, TopicWithCount } from "./database-type";

export interface LocalChangeTopicStateType {
  isLoading: boolean;

  topic: Topic | null;
  topics: Topic[];
  publicTopics: Topic[];
  userTopics: TopicWithCount[];
  selectedTopic: Topic | null;
  explorerTopics: Topic[];

  setSelectedTopic: (topic: Topic | null) => void;

  loadPublicTopics: () => Promise<void>;
  loadUserTopics: (userId: string) => Promise<void>;
  createTopic: (topic: Topic) => Promise<Topic>;
  updateTopic: (topic: Topic) => Promise<void>;
  getTopicById: (id: string) => Promise<Topic | null>;
  removeTopic: (id: string) => Promise<void>;
  updateTopicsAfterLogin: (newId: string, lastId: string) => Promise<void>;
  searchTopics: (search: string) => Promise<void>;
  getAllTopic: () => Promise<Topic[]>;

  reloadTopics: (topic: Topic) => Promise<void>;
}


export interface ServerChangeTopicStateType {

  isLoading: boolean;
  getTopicsByApi: () => Promise<void>;
  getTopicByIdApi: (id: string) => Promise<void>;
  getTopicsByUserIdApi: (userId: string) => Promise<void>;
}
