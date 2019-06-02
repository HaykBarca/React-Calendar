import React from 'react';
import moment from 'moment';

import './Calendar.css';

class Calendar extends React.Component {
  state = {
    dateObject: moment(),
    currentDate: moment(),
    selectedDay: moment(),
  }

  onChangeMonth = (next) => {
    const { dateObject } = this.state;
    if (next) {
      let newDateObject = moment().year(dateObject.year()).month(dateObject.month() + 1);
      if (newDateObject.year() !== dateObject.year()) {
        newDateObject = moment().year(newDateObject.year()).month(0);
      }
      this.setState({ dateObject: newDateObject });
      return;
    }

    let newDateObject = moment().year(dateObject.year()).month(dateObject.month() - 1);
    if (newDateObject.year() !== dateObject.year()) {
      newDateObject = moment().year(newDateObject.year()).month(11);
    }
    this.setState({ dateObject: newDateObject });
  }

  onSelectDay(day) {
    const { dateObject } = this.state;
    const selectedDate = dateObject.date(day);
    this.setState({ selectedDay: selectedDate });
  }

  weekdaysShort = () => {
    const WEEKDAYS_SHORT = moment.weekdaysShort();
    const WEEKDAYS_SHORT_NAME = WEEKDAYS_SHORT.map((day) => {
      return (
        <th key={day} className="week-day">
          {day}
        </th>
      );
    });
    return WEEKDAYS_SHORT_NAME;
  }

  monthAndYear = () => {
    const { dateObject } = this.state;
    return (
      <div className="month-year">
        <button
          className="prev-month"
          type="button"
          onClick={() => { this.onChangeMonth(false); }}
        >
          <i className="glyphicon glyphicon-menu-left" />
        </button>

        <span className="month">{`${dateObject.format('MMMM')} `}</span>
        <span className="year">{dateObject.format('YYYY')}</span>

        <button
          type="button"
          className="next-month"
          onClick={() => { this.onChangeMonth(true); }}
        >
          <i className="glyphicon glyphicon-menu-right" />
        </button>
      </div>
    );
  }

  firstDayOfMonth() {
    const { dateObject } = this.state;
    const firstDay = moment(dateObject).startOf('month').format('d');
    return firstDay;
  }

  daysInMonth() {
    const { dateObject } = this.state;
    return dateObject.daysInMonth();
  }

  dayCells() {
    const { dateObject } = this.state;
    const { currentDate } = this.state;
    const { selectedDay } = this.state;
    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      blanks.push(
        <td key={`empty-${i}`} className="calendar-day empty" />,
      );
    }

    const daysInMonth = [];
    const activeClassName = dateObject.format('M, YYYY') === currentDate.format('M, YYYY') ? 'current' : '';
    const selectedClassName = dateObject.format('M, YYYY') === selectedDay.format('M, YYYY') ? 'selected' : '';
    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      daysInMonth.push(
        <td
          key={d}
          className={`calendar-day ${currentDate.date() === d ? activeClassName : ''} ${selectedDay.date() === d ? selectedClassName : ''}`}
        >
          <button onClick={() => { this.onSelectDay(d); }} type="button" className="btn btn-link custom">{d}</button>
        </td>,
      );
    }

    const totalSlots = [...blanks, ...daysInMonth];
    const rows = [];
    let cells = [];
    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) { // when end loop we add remain date
        rows.push(cells);
      }
    });

    const daysinmonth = rows.map((d, i) => {
      const key = i;
      return <tr key={`row-${key}`}>{d}</tr>;
    });

    return (
      <table className="calendar-day">
        <thead>
          <tr>{this.weekdaysShort()}</tr>
        </thead>
        <tbody>{daysinmonth}</tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="container">
        <h2>Calendar</h2>
        {this.monthAndYear()}
        {this.dayCells()}
      </div>
    );
  }
}

export default Calendar;
