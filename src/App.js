import React from 'react';
import './App.css';
import Menu from "./Menu";
import Stopwatch from "./Stopwatch";

class App extends React.Component {
    state = {
        stopwatches: [],
        currentTime: undefined
    };

    constructor(param) {
        super(param);

        this.goToStopwatch = this.goToStopwatch.bind(this);
        this.deleteStopwatch = this.deleteStopwatch.bind(this);
        this.makeNewStopwatch = this.makeNewStopwatch.bind(this);

        this.closeStopwatch = this.closeStopwatch.bind(this);
        this.setMarkerOnStopwatch = this.setMarkerOnStopwatch.bind(this);
        this.setTimeOnStopwatch = this.setTimeOnStopwatch.bind(this);
    }

    componentDidMount() {
        const stopwatchesState = localStorage.getItem('stopwatches');
        if (stopwatchesState) {
            this.setState(JSON.parse(stopwatchesState));
        }
    }

    setStateAndStore(param) {
        this.setState(param, () => localStorage.setItem('stopwatches', JSON.stringify(this.state)));
    }

    goToStopwatch(time) {
        this.setStateAndStore({currentTime: time});
    }

    deleteStopwatch(time) {
        if (!window.confirm('Are you sure you want to delete this timer?')) {
            return;
        }
        this.setStateAndStore({stopwatches: this.state.stopwatches.filter((stopwatch) => stopwatch.time !== time)});
    }

    setMarkerOnStopwatch(stopwatch, time, checked = false, message = '') {
        const marker = {time, checked, message};
        const stopwatches = this.state.stopwatches.filter((s) => s.time !== stopwatch.time);
        return new Promise((resolve) => {
            let index = stopwatch.markers.findIndex((m) => m.time === time);
            if (index === -1) {
                index = stopwatch.markers.length;
            }
            this.setStateAndStore({
                stopwatches: [{
                    time: stopwatch.time,
                    markers: [...stopwatch.markers.slice(0, index), marker, ...stopwatch.markers.slice(index + 1)]
                }, ...stopwatches]
            }, resolve);
        });
    }

    setTimeOnStopwatch(stopwatch, time) {
        const stopwatches = this.state.stopwatches.filter((s) => s.time !== stopwatch.time);
        return new Promise((resolve) => {
            this.setStateAndStore({
                currentTime: this.state.currentTime === stopwatch.time ? time : stopwatch.time,
                stopwatches: [{
                    time: time,
                    markers: stopwatch.markers
                }, ...stopwatches]
            }, resolve);
        });
    }

    makeNewStopwatch() {
        const stopwatch = {
            time: new Date().getTime(),
            markers: []
        };
        this.setStateAndStore({currentTime: stopwatch.time, stopwatches: [...this.state.stopwatches, stopwatch]});
    }

    closeStopwatch() {
        this.setStateAndStore({currentTime: undefined});
    }

    render() {
        if (!this.state.currentTime) {
            return (
                <Menu
                    stopwatches={this.state.stopwatches}
                    goToTime={this.goToStopwatch}
                    deleteTime={this.deleteStopwatch}
                    makeNewTime={this.makeNewStopwatch}
                />
            );
        }
        return (
            <Stopwatch
                stopwatch={this.state.stopwatches.find((stopwatch) => stopwatch.time === this.state.currentTime)}
                closeStopwatch={this.closeStopwatch}
                setMarkerOnStopwatch={this.setMarkerOnStopwatch}
                setTimeOnStopwatch={this.setTimeOnStopwatch}
            />
        );
    }
}

export default App;
