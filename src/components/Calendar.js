import React from 'react';
import moment from 'moment';

import './Calendar.css';

class Calendar extends React.Component {
    state = {
        dateObject: moment(),
        currentDate: moment(),
        selectedDay: moment()
    }

    firstDayOfMonth() {
        let dateObject = this.state.dateObject;
        let firstDay = moment(dateObject)
                     .startOf("month")
                     .format("d"); 
       return firstDay;
    }

    daysInMonth() {
        return this.state.dateObject.daysInMonth();
    }

    weekdaysShort() {
        const WEEKDAYS_SHORT = moment.weekdaysShort();
        const WEEKDAYS_SHORT_NAME = WEEKDAYS_SHORT.map(day => {
            return(
                <th key={day} className="week-day">
                    {day}
                </th>
            );
        });
        return WEEKDAYS_SHORT_NAME;
    }

    dayCells() {
        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(
                <td key={`empty-${i}`} className="calendar-day empty">{""}</td>
            );
        }

        let daysInMonth = [];
        let activeClassName = '';
        let selectedClassName = '';
        this.state.dateObject.format('M, YYYY') === this.state.currentDate.format('M, YYYY') ? activeClassName = 'current' : activeClassName = '';
        this.state.dateObject.format('M, YYYY') === this.state.selectedDay.format('M, YYYY') ? selectedClassName = 'selected' : selectedClassName = '';
        for (let d = 1; d <= this.daysInMonth(); d++) {
            daysInMonth.push(
                <td
                    key={d}
                    className={`calendar-day ${this.state.currentDate.date() === d ? activeClassName : ''} ${this.state.selectedDay.date() === d ? selectedClassName : ''}`}
                    onClick={() => this.onSelectDay(d, this)}>
                    {d}
                </td>
            );
        }

        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];
        totalSlots.forEach((row, i) => {
            if (i % 7 !== 0) {
                 cells.push(row); // if index not equal 7 that means not go to next week
            } else {
                rows.push(cells); // when reach next week we contain all td in last week to rows 
                cells = []; // empty container 
                cells.push(row); // in current loop we still push current row to new container
            }
            if (i === totalSlots.length - 1) { // when end loop we add remain date
                rows.push(cells);
            }
        });

        let daysinmonth = rows.map((d, i) => {
            return <tr key={`row-${i}`}>{d}</tr>;
        });
        
        return(
            <table className="calendar-day">
                <thead>
                    <tr>{this.weekdaysShort()}</tr>
                </thead>
                <tbody>{daysinmonth}</tbody>
            </table>
        );
    }

    monthAndYear = () => {
        return(
            <div className="month-year">
                <button 
                    className="prev-month"
                    onClick={() => this.onChangeMonth(false)}>
                        <i class="fas fa-chevron-left"></i>
                    </button>

                    <span className="month">{this.state.dateObject.format('MMMM') + ' '}</span>
                    <span className="year">{this.state.dateObject.format('YYYY')}</span>

                <button 
                    className="next-month"
                    onClick={() => this.onChangeMonth(true)}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
            </div>
        );
    }

    onChangeMonth = (next) => {
        if (next) {
            let newDateObject = moment().year(this.state.dateObject.year()).month(this.state.dateObject.month() + 1);
            if (newDateObject.year() !== this.state.dateObject.year()) {
                newDateObject = moment().year(newDateObject.year()).month(0);
            }            
            this.setState({dateObject: newDateObject});
            return;
        }

        let newDateObject = moment().year(this.state.dateObject.year()).month(this.state.dateObject.month() - 1);
        if (newDateObject.year() !== this.state.dateObject.year()) {
            newDateObject = moment().year(newDateObject.year()).month(11);
        }            
        this.setState({dateObject: newDateObject});
    }

    onSelectDay(day, self) {
        let selectedDate = this.state.dateObject.date(day);
        this.setState({ selectedDay: selectedDate });
    }

    render() {
        return(
            <div className="container">
                <h2>Calendar</h2>
                {this.monthAndYear()}
                {this.dayCells()}
            </div>
        );
    }
}

export default Calendar;