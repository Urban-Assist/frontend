import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Calendar as CalendarIcon, User, ChevronRight } from "lucide-react";

const localizer = momentLocalizer(moment);

const ClientBookingPage = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment().toDate());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("calendar");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { Id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const service = queryParams.get('service');

  const fetchAvailabilities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/availabilities/get`,
        { service: service, id: Id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const transformedData = response.data.map(slot => ({
        _id: slot.id.toString(),
        date: moment(slot.startTime).format("YYYY-MM-DD"),
        startTime: moment(slot.startTime).format("HH:mm"),
        endTime: moment(slot.endTime).format("HH:mm"),
        providerEmail: slot.providerEmail,
        service: slot.service,
        originalStartTime: slot.startTime,
        originalEndTime: slot.endTime
      }));

      setAvailabilities(transformedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
      setError("Failed to load availabilities. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const getSlotsForSelectedDate = () => {
    return availabilities.filter((slot) =>
      moment(slot.date).isSame(moment(selectedDate), "day")
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (window.innerWidth < 768) {
      setView("slots");
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    navigate("/payment", { state: { selectedSlot,Id,service } });
  };

  const CustomDateCellWrapper = ({ children, value }) => {
    const hasSlots = availabilities.some((slot) =>
      moment(slot.date).isSame(moment(value), "day")
    );
    const isToday = moment(value).isSame(moment(), "day");
    const isSelected = moment(value).isSame(moment(selectedDate), "day");

    return (
      <div
        className={`relative h-full w-full flex items-center justify-center cursor-pointer rounded-md transition-all duration-200 ${
          hasSlots 
            ? "hover:bg-blue-100" 
            : ""
        } ${
          isToday 
            ? "border border-indigo-500" 
            : ""
        } ${
          isSelected 
            ? "bg-blue-100 font-bold" 
            : hasSlots ? "bg-blue-50" : ""
        }`}
        role="button"
        tabIndex="0"
        aria-label={`${moment(value).format("MMMM D")} ${hasSlots ? 'has available slots' : 'no available slots'}`}
        onKeyDown={(e) => e.key === 'Enter' && handleDateSelect(value)}
      >
        {hasSlots && (
          <div className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-500"></div>
        )}
        {children}
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-lg" role="alert">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={fetchAvailabilities}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            aria-label="Retry loading availabilities"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:w-full lg:w-[70vw] mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-12 px-4 mt-16">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Your Appointment</h1>
          <p className="text-blue-100">Service: {service}</p>
          <div className="flex items-center mt-4" aria-label="Booking steps">
            <div className="flex items-center">
              <CalendarIcon size={16} className="mr-2" aria-hidden="true" />
              <span>Select date</span>
            </div>
            <ChevronRight size={16} className="mx-2" aria-hidden="true" />
            <div className="flex items-center">
              <Clock size={16} className="mr-2" aria-hidden="true" />
              <span>Choose time</span>
            </div>
            <ChevronRight size={16} className="mx-2" aria-hidden="true" />
            <div className="flex items-center">
              <User size={16} className="mr-2" aria-hidden="true" />
              <span>Confirm booking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden bg-white p-4 sticky top-0 z-10 border-b shadow-sm">
        <div className="flex justify-center space-x-4" role="tablist">
          <button 
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-md ${view === "calendar" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
            role="tab"
            aria-selected={view === "calendar"}
            aria-controls="calendar-view"
          >
            Calendar
          </button>
          <button 
            onClick={() => setView("slots")}
            className={`px-4 py-2 rounded-md ${view === "slots" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
            role="tab"
            aria-selected={view === "slots"}
            aria-controls="slots-view"
          >
            Time Slots
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div 
            className={`w-full md:w-1/2 lg:w-3/5 ${view !== "calendar" && "hidden md:block"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            id="calendar-view"
            role="tabpanel"
            aria-labelledby="calendar-tab"
          >
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
              {isLoading ? (
                <div className="h-96 flex items-center justify-center" aria-live="polite">
                  <div 
                    className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
                    role="status"
                    aria-label="Loading calendar"
                  >
                    <span className="sr-only">Loading calendar...</span>
                  </div>
                </div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={[]}
                  defaultView="month"
                  views={["month"]}
                  onSelectSlot={(slot) => handleDateSelect(slot.start)}
                  onNavigate={(date) => setSelectedDate(date)}
                  selectable
                  className="rounded-lg"
                  style={{ height: 400 }}
                  date={selectedDate}
                  onSelectDate={handleDateSelect}
                  components={{
                    dateCellWrapper: CustomDateCellWrapper,
                  }}
                  aria-label="Availability calendar"
                />
              )}
              <div className="mt-4 flex items-center text-gray-600">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-blue-50 border border-indigo-500 mr-1"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-100 mr-1"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`w-full md:w-1/2 lg:w-3/5 ${view !== "slots" && "hidden md:block"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            id="slots-view"
            role="tabpanel"
            aria-labelledby="slots-tab"
          >
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-indigo-500" aria-hidden="true" />
                <span>Available Times for {moment(selectedDate).format("dddd, MMMM D")}</span>
              </h2>

              {isLoading ? (
                <div className="h-64 flex items-center justify-center" aria-live="polite">
                  <div 
                    className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
                    role="status"
                    aria-label="Loading time slots"
                  >
                    <span className="sr-only">Loading time slots...</span>
                  </div>
                </div>
              ) : getSlotsForSelectedDate().length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list">
                  {getSlotsForSelectedDate().map((slot) => (
                    <motion.div
                      key={slot._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedSlot?._id === slot._id
                          ? "bg-blue-100 border-2 border-indigo-500 shadow-md"
                          : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                      role="listitem"
                      tabIndex="0"
                      aria-label={`Time slot from ${moment(slot.startTime, "HH:mm").format("h:mm A")} to ${moment(slot.endTime, "HH:mm").format("h:mm A")}`}
                      aria-pressed={selectedSlot?._id === slot._id}
                      onKeyDown={(e) => e.key === 'Enter' && handleSlotSelect(slot)}
                    >
                      <div className="text-center">
                        <div className="font-medium text-lg">
                          {moment(slot.startTime, "HH:mm").format("h:mm A")}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {moment(slot.endTime, "HH:mm").format("h:mm A")}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg" aria-live="polite">
                  <CalendarIcon size={48} className="text-gray-300 mb-4" aria-hidden="true" />
                  <p className="text-gray-500 mb-2">No slots available for this date.</p>
                  <p className="text-sm text-gray-400">Please select another date from the calendar.</p>
                </div>
              )}
            </div>

            <motion.div 
              className="mt-6 bg-white p-4 md:p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <User size={20} className="mr-2 text-indigo-500" aria-hidden="true" />
                <span>Appointment Details</span>
              </h2>

              {selectedSlot ? (
                <div className="border-l-4 border-indigo-500 pl-4 py-2" aria-live="polite">
                  <p className="font-medium text-lg">
                    {moment(selectedSlot.date).format("dddd, MMMM D, YYYY")}
                  </p>
                  <p className="text-gray-600 mb-2">
                    {moment(selectedSlot.startTime, "HH:mm").format("h:mm A")} - {moment(selectedSlot.endTime, "HH:mm").format("h:mm A")}
                  </p>
                  <div className="flex items-center text-gray-500 mb-4">
                    <User size={16} className="mr-2" aria-hidden="true" />
                    <span>{selectedSlot.providerEmail}</span>
                  </div>
                  <div className="flex items-center mt-4">
                    <p className="mr-4 text-gray-500">Service: <span className="font-medium text-gray-700">{service}</span></p>
                  </div>
                  <button
                    onClick={handleConfirmBooking}
                    className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-500 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all shadow-md hover:shadow-lg"
                    aria-label="Confirm booking"
                  >
                    Confirm Booking
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center" aria-live="polite">
                  <p className="text-gray-500">Please select a time slot to continue.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClientBookingPage;