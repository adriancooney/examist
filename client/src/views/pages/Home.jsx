import "../../../style/pages/Home.scss";
import React, { Children } from "react";
import { range } from "lodash/util";
import Header from "../templates/Header";
import Footer from "../templates/Footer";
import { Flex, Box } from "../ui/layout";
import { Button } from "../ui/input";
import { Question } from "../ui/question";
import { CourseLink } from "../ui/course";
import { Course } from "../app/Course";
import data from "./HomeData.json";

export default function Home() {
    return (
        <div className="Home">
            <div className="home-header">
                <div className="container">
                    <Header />
                    <h3>Your exams, online.</h3>
                </div>
            </div>
            <div className="container">
                <Box className="trio">
                    <Flex>
                        <img src="assets/icon/collaborative.svg" />
                        <h3>Collaborative</h3>
                        <p lang="en">Examist is a collaborative plat&shy;form where you and your class&shy;mates can work together on exam papers.</p>
                    </Flex>
                    <Flex>
                        <img src="assets/icon/comprehensive.svg" />
                        <h3>Comprehensive</h3>
                        <p>All of your courses and exam papers are available through Examist.</p>
                    </Flex>
                    <Flex>
                        <img src="assets/icon/clever.svg" />
                        <h3>Clever</h3>
                        <p>Examist will help you get started by showing you the popular questions in your course.</p>
                    </Flex>
                </Box>

                <div className="home-content">
                    <Box className="sample-question">
                        <Question {...data.question} getQuestion={id => data.questions[id + ""]} />
                        <div className="copy">
                            <img src="assets/icon/view.svg" />
                            <p lang="en">Access all of your papers questions online via a simple, user friendly interface. Comment, post solutions and notes and view similar questions.</p>
                        </div>
                    </Box>

                    <Box className="sample-course">
                        <div className="copy">
                            <img src="assets/icon/gauge.svg" />
                            <p>Quickly access papers from your courses and never feel the frustration from using the old college legacy systems again.</p>
                        </div>
                        <Course {...data.sampleCourse} years={range(2008, 2015)}><noscript/></Course>
                    </Box>

                    <Box className="sample-courses">
                        <div>{ Children.toArray(data.courses.slice(0, 3).map(course => <CourseLink {...course} />)) }</div>
                        <div className="copy">
                            <img src="assets/icon/database.svg" />
                            <p>A compre&shy;hensive data&shy;base of all courses in your college to pick from.</p>
                        </div>
                        <div>{ Children.toArray(data.courses.slice(3, 6).map(course => <CourseLink {...course} />)) }</div>
                    </Box>

                    <section className="signup-action">
                        <p>Get started studying for your exams right now.</p>
                        <Button to="/signup">Sign up</Button>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}