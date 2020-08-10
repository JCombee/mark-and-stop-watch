import React from 'react';
import NoSleep from 'nosleep.js';

class Stopwatch extends React.Component {
    state = {
        time: 0
    };

    constructor(props) {
        super(props);

        this.setTime = this.setTime.bind(this);
        this.resetClock = this.resetClock.bind(this);
        this.setMarker = this.setMarker.bind(this);

        this.noSleep = new NoSleep();
    }

    componentDidMount() {
        this.noSleep.enable();

        this.setState({
            time: Math.round((new Date() - new Date(this.props.stopwatch.time)))
        });
        this.interval = setInterval(() => {
            this.setState({
                time: Math.round((new Date() - new Date(this.props.stopwatch.time)))
            });
        }, 1000);
    }

    setMarker() {
        if (!this.props.stopwatch.markers.every((marker) => marker.time !== this.state.time)) {
            return;
        }

        this.props.setMarkerOnStopwatch(this.props.stopwatch, this.state.time)
            .then(() => {
                document.getElementById('markers').scrollTo(0, document.getElementById('markers').scrollHeight);
            });
    }

    componentWillUnmount() {
        this.noSleep.disable();
        clearInterval(this.interval);
    }

    setTime() {
        const hours = document.getElementById('hours').value * 60 * 60 * 1000;
        const minutes = document.getElementById('minutes').value * 60 * 1000;
        const seconds = document.getElementById('seconds').value * 1000;
        this.setState({setTime: false});
        this.props.setTimeOnStopwatch(this.props.stopwatch, new Date() - hours - minutes - seconds);
    }

    resetClock() {
        this.noSleep.disable();
        clearInterval(this.interval);
        this.interval = undefined;
        this.props.closeStopwatch();
    }

    formatTime(time) {
        const hours = Math.round(time / 1000 / 60 / 60) % 60;
        const minutes = Math.round(time / 1000 / 60) % 60;
        const seconds = Math.round(time / 1000) % 60;
        return ('0' + hours).substr(-2) + ':' + ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
    }

    setMessage(time, checked, message) {
        this.props.setMarkerOnStopwatch(this.props.stopwatch, time, checked, message);
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div>
                    {this.formatTime(this.state.time)}
                </div>
                <div style={{height: '100%', overflowY: 'scroll'}} id="markers">
                    {this.props.stopwatch.markers.map((marker) => (
                        <div className="input-group flex-nowrap" key={marker.time}>
                            <div className="input-group-text">
                                <input
                                    type="checkbox" aria-label="Checkbox for following text input"
                                    checked={marker.checked}
                                    onChange={(event) => this.setMessage(marker.time, event.target.checked, marker.message)}
                                />
                            </div>
                            <div className="input-group-append">
                                <span className="input-group-text">{this.formatTime(marker.time)}</span>
                            </div>
                            <input type="text" className="form-control"
                                   aria-describedby="addon-wrapping"
                                   value={marker.message}
                                   onChange={(event) => this.setMessage(marker.time, marker.checked, event.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <button type="button" className="btn btn-info btn-lg btn-block" onClick={this.setMarker}>Set
                        Marker
                    </button>
                </div>
                <div>
                    <button type="button" className="btn btn-danger btn-lg btn-block"
                            onClick={this.resetClock}>Reset
                    </button>
                </div>
                {this.state.setTime || (
                    <div>
                        <button type="button" className="btn btn-primary btn-lg btn-block"
                                onClick={() => this.setState({setTime: true})}>Set Time
                        </button>
                    </div>
                )}
                {this.state.setTime && (
                    <div>
                        <div className="input-group">
                            <div className="custom-file">
                                <input type="number" className="form-control"
                                       aria-describedby="inputGroupFileAddon04" id="hours"/>
                            </div>
                            <span className="input-group-text">:</span>
                            <div className="custom-file">
                                <input type="number" className="form-control"
                                       aria-describedby="inputGroupFileAddon04" id="minutes"/>
                            </div>
                            <span className="input-group-text">:</span>
                            <div className="custom-file">
                                <input type="number" className="form-control"
                                       aria-describedby="inputGroupFileAddon04" id="seconds"/>
                            </div>
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="button"
                                        id="inputGroupFileAddon04" onClick={this.setTime}>Set
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Stopwatch;
