import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {
  getDay,
  getMonth,
  getDate,
  now,
  isMoment,

  isSameDay as oldIsSameDay,
  isDayDisabled,
  isDayInRange,
  getDayOfWeekCode
} from './date_utils'

const Day = (props) => {
  const handleClick = (event) => {
    if (!isDisabled() && props.onClick) {
      props.onClick(event)
    }
  }

  const handleMouseEnter = (event) => {
    if (!isDisabled() && props.onMouseEnter) {
      props.onMouseEnter(event)
    }
  }

  const isSameDay = (other) => oldIsSameDay(props.day, other)

  const isKeyboardSelected = () =>
    !props.inline && !isSameDay(props.selected) && isSameDay(props.preSelection)

  const isDisabled = () => isDayDisabled(props.day, props)

  const getHighLightedClass = (defaultClassName) => {
    const {day, highlightDates} = props

    if (!highlightDates) {
      return {[defaultClassName]: false}
    }

    const classNames = {}
    for (let i = 0, len = highlightDates.length; i < len; i++) {
      const obj = highlightDates[i]
      if (isMoment(obj)) {
        if (isSameDay(day, obj)) {
          classNames[defaultClassName] = true
        }
      } else if (typeof obj === 'object') {
        const keys = Object.keys(obj)
        const arr = obj[keys[0]]
        if (typeof keys[0] === 'string' && arr.constructor === Array) {
          for (let k = 0, len = arr.length; k < len; k++) {
            if (isSameDay(day, arr[k])) {
              classNames[keys[0]] = true
            }
          }
        }
      }
    }

    return classNames
  }

  const isInRange = () => {
    const {day, startDate, endDate} = props
    if (!startDate || !endDate) {
      return false
    }
    return isDayInRange(day, startDate, endDate)
  }

  const isInSelectingRange = () => {
    const {day, selectsStart, selectsEnd, selectingDate, startDate, endDate} = props

    if (!(selectsStart || selectsEnd) || !selectingDate || isDisabled()) {
      return false
    }

    if (selectsStart && endDate && selectingDate.isSameOrBefore(endDate)) {
      return isDayInRange(day, selectingDate, endDate)
    }

    if (selectsEnd && startDate && selectingDate.isSameOrAfter(startDate)) {
      return isDayInRange(day, startDate, selectingDate)
    }

    return false
  }

  const isSelectingRangeStart = () => {
    if (!isInSelectingRange()) {
      return false
    }

    const {day, selectingDate, startDate, selectsStart} = props

    if (selectsStart) {
      return isSameDay(day, selectingDate)
    } else {
      return isSameDay(day, startDate)
    }
  }

  const isSelectingRangeEnd = () => {
    if (!isInSelectingRange()) {
      return false
    }

    const {day, selectingDate, endDate, selectsEnd} = props

    if (selectsEnd) {
      return isSameDay(day, selectingDate)
    } else {
      return isSameDay(day, endDate)
    }
  }

  const isRangeStart = () => {
    const {day, startDate, endDate} = props
    if (!startDate || !endDate) {
      return false
    }
    return isSameDay(startDate, day)
  }

  const isRangeEnd = () => {
    const {day, startDate, endDate} = props
    if (!startDate || !endDate) {
      return false
    }
    return isSameDay(endDate, day)
  }

  const isWeekend = () => {
    const weekday = getDay(props.day)
    return weekday === 0 || weekday === 6
  }

  const isOutsideMonth = () => {
    return props.month !== undefined &&
      props.month !== getMonth(props.day)
  }

  const getClassNames = (date) => {
    const dayClassName = (props.dayClassName ? props.dayClassName(date) : undefined)
    return classnames('react-datepicker__day', dayClassName, 'react-datepicker__day--' + getDayOfWeekCode(props.day), {
      'react-datepicker__day--disabled': isDisabled(),
      'react-datepicker__day--selected': isSameDay(props.selected),
      'react-datepicker__day--keyboard-selected': isKeyboardSelected(),
      'react-datepicker__day--range-start': isRangeStart(),
      'react-datepicker__day--range-end': isRangeEnd(),
      'react-datepicker__day--in-range': isInRange(),
      'react-datepicker__day--in-selecting-range': isInSelectingRange(),
      'react-datepicker__day--selecting-range-start': isSelectingRangeStart(),
      'react-datepicker__day--selecting-range-end': isSelectingRangeEnd(),
      'react-datepicker__day--today': isSameDay(now(props.utcOffset)),
      'react-datepicker__day--weekend': isWeekend(),
      'react-datepicker__day--outside-month': isOutsideMonth()
    }, getHighLightedClass('react-datepicker__day--highlighted'))
  }

  return (
    <div
        key={props.key}
        className={getClassNames(props.day)}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        aria-label={`day-${getDate(props.day)}`}
        role="option">
      {getDate(props.day)}
    </div>
  )
}

Day.prototype.propTypes = {
  day: PropTypes.object.isRequired,
  dayClassName: PropTypes.func,
  endDate: PropTypes.object,
  highlightDates: PropTypes.array,
  inline: PropTypes.bool,
  month: PropTypes.number,
  key: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
  selectingDate: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  startDate: PropTypes.object,
  utcOffset: PropTypes.number
}

export default Day
