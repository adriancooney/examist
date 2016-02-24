import React, { PropTypes } from "react";
import CoursePlaceholder from "./CoursePlaceholder";
import CourseLink from "./CourseLink";

export default function CourseList(props) {
    let courses = props.courses || [];

    courses = courses.map((mod, key) => {
        return (
            <CourseLink 
                course={mod} 
                key={key} 
                onRemove={props.onRemove && props.onRemove.bind(null, mod)} 
                onAdd={props.onAdd && props.onAdd.bind(null, mod)} />
        );
    });

    if(props.placeholderCount && props.placeholderCount > courses.length) {
        for(let i = 0, count = props.placeholderCount - courses.length; i < count; i++) {
            courses.push(<CoursePlaceholder key={courses.length + i}/>);
        }
    }

    return (
        <div className="CourseList">
            { courses }
        </div>
    );
}

CourseList.propTypes = {
    placeholderCount: PropTypes.number, // The number of dummy items to place
    courses: PropTypes.array,
    onRemove: PropTypes.func,
    onAdd: PropTypes.func
};