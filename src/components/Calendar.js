import React from 'react';
import moment from 'moment';

import './Calendar.css';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.refsArray = [];
  }

  state = {
    dateObject: moment(),
    currentDate: moment(),
    color: '#ff0',
    selectedDaysAndColor: [
      { date: moment(), color: '#c00101' },
    ],
  }

  componentDidUpdate() {
    const { dateObject } = this.state;
    const { selectedDaysAndColor } = this.state;
    selectedDaysAndColor.map((day) => {
      if (dateObject.format('M, YYYY') === day.date.format('M, YYYY')) {
        const cell = this.refsArray[+day.date.format('D')];
        cell.style.backgroundColor = day.color;
      }
      return true;
    });

    this.refsArray.map((ref) => {
      if (!ref) { return true; }
      let isIncluding = false;
      for (let i = 0; i < selectedDaysAndColor.length; i += 1) {
        if (selectedDaysAndColor[i].date.format('M, YYYY') === dateObject.format('M, YYYY')
        && ref.innerText === selectedDaysAndColor[i].date.format('D')) {
          isIncluding = true;
          break;
        }
      }

      if (!isIncluding) {
        // eslint-disable-next-line no-param-reassign
        ref.style.backgroundColor = '#fff';
      }
      return true;
    });
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
    const { selectedDaysAndColor } = this.state;
    const { color } = this.state;
    const selectedDate = moment(dateObject).date(day);
    let permanentDays = [...selectedDaysAndColor];
    let keep = true;
    for (let i = 0; i < permanentDays.length; i += 1) {
      if (permanentDays[i].date.format('D, MM, YYYY') === selectedDate.format('D, MM, YYYY')) {
        permanentDays.splice(i, 1);
        keep = false;
      }
    }
    if (keep) {
      permanentDays = [...permanentDays, { date: selectedDate, color }];
    }

    this.setState({
      selectedDaysAndColor: [
        ...permanentDays,
      ],
    });
  }

  weekdaysShort = () => {
    const WEEKDAYS_SHORT = moment.weekdaysShort(true);
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
    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      blanks.push(
        <td key={`empty-${i}`} className="calendar-day empty" />,
      );
    }

    const daysInMonth = [];
    const activeClassName = dateObject.format('M, YYYY') === currentDate.format('M, YYYY') ? 'current' : '';
    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      daysInMonth.push(
        <td
          key={d}
          className={`calendar-day ${currentDate.date() === d ? activeClassName : ''}`}
          ref={(ref) => { this.refsArray[d] = ref; return true; }}
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
      <table className="calendar-day table">
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
        <div className="table-responsive">
          {this.dayCells()}
        </div>
      </div>
    );
  }
}

export default Calendar;
