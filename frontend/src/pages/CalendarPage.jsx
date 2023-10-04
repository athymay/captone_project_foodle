import React from 'react';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import styled from '@emotion/styled';
import { StoreContext } from '../Store.jsx';
import { AppContext } from '../AppContext';

export const StyleWrapper = styled.div`
    .fc-media-screen {
      height: 100% !important;
      width: 800px!important;
    }
    .fc-daygrid-day-frame {
      cursor: pointer;
    }
    .fc-day-today {
      color: white !important;
      background-color: #3BB927 !important;
    }
    .fc-button-primary {
      background-color: #484848 !important;
      border-radius: 5px !important;
      border: 1px solid white !important
    }
    .fc-daygrid-day-events {
      font-weight: normal;
      text-align: center;
    }
`;

export default function CalendarPage() {
  const context = React.useContext(StoreContext);
  const { token, setShowSidebarTabOptions } = React.useContext(AppContext);
  const initialDate = new Date()
  var dateStr = initialDate.getFullYear() + "-" + ("0"+(initialDate.getMonth()+1)).slice(-2) + "-" + ("0" + initialDate.getDate()).slice(-2)

  function handleSelectedDate(dateElement) {
    context.setSelectedDate(dateElement.dateStr)
    let days = document.querySelectorAll(".selectedDate");
    days.forEach(function(day) {
      day.classList.remove("selectedDate");
    });
    dateElement.dayEl.classList.add("selectedDate");
  }

  React.useEffect(() => {
    setShowSidebarTabOptions(true);
    context.setSelectedDate(dateStr)
    console.log("change date")
  }, [setShowSidebarTabOptions]);

  return (
    <div className="calendar-page">
      <div id="calendar-top-content">
      </div>
      {token ? 
      <div id="calendar-month">
        <StyleWrapper>
          <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            dateClick={(e) => handleSelectedDate(e)}
          />
        </StyleWrapper>
      </div>
      : null}
    </div>
  )
}
