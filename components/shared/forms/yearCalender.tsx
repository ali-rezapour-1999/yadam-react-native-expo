import JalaliYearCalendar from "../datePicker/jalaliYearCalnder";
import GregorianYearCalendar from "../datePicker/gregorianYearCalnder";
import { useBaseStore } from "@/store/baseState/base";

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const YearCalendar: React.FC<Props> = ({ selectedDate, setSelectedDate }) => {
  const calender = useBaseStore().calender;

  if (calender == 'jalali') {
    return <JalaliYearCalendar selectedDate={selectedDate} setSelectedDateTime={setSelectedDate} />;
  }

  return <GregorianYearCalendar selectedDate={selectedDate} setSelectedDateTime={setSelectedDate} />;
};

export default YearCalendar;
