import { useAppStore } from "@/store/appState";
import JalaliYearCalendar from "../datePicker/jalaliYearCalnder";
import GregorianYearCalendar from "../datePicker/gregorianYearCalnder";

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const YearCalendar: React.FC<Props> = ({ selectedDate, setSelectedDate }) => {
  const { calender } = useAppStore();

  if (calender == 'jalali') {
    return <JalaliYearCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
  }

  return <GregorianYearCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />;
};

export default YearCalendar;
