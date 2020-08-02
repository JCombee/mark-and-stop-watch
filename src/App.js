import React from 'react';
import './App.css';
import NoSleep from 'nosleep.js';

class App extends React.Component {
    state = {
        time: 0,
        markers: []
    };

    setMarker() {
        if (!this.state.markers.every((marker) => marker.time !== this.state.time)) {
            return;
        }

        this.setState({
            markers: [...this.state.markers, {time: this.state.time, message: ''}]
        }, () => {
            document.getElementById('markers').scrollTo(0, document.getElementById('markers').scrollHeight);
            localStorage.setItem('markers', JSON.stringify(this.state.markers));
        });
    }

    constructor(props) {
        super(props);

        this.setTime = this.setTime.bind(this);
        this.resetClock = this.resetClock.bind(this);
        this.setMarker = this.setMarker.bind(this);
    }

    componentDidMount() {
        this.noSleep = new NoSleep();
        const startTime = localStorage.getItem('startTime');
        if (startTime) {
            this.startClock(new Date(startTime));
        }
        const markers = localStorage.getItem('markers');
        if (markers) {
            this.setState({
                markers: JSON.parse(markers)
            })
        }
    }

    startClock(time) {
        this.noSleep.enable();

        this.setState({
            startTime: time
        }, () => {
            localStorage.setItem('startTime', this.state.startTime);
            this.setState({
                time: Math.round((new Date() - this.state.startTime))
            });
            this.interval = setInterval(() => {
                this.setState({
                    time: Math.round((new Date() - this.state.startTime))
                });
            }, 1000);
        });
    }

    setTime() {
        const hours = document.getElementById('hours').value * 60 * 60 * 1000;
        const minutes = document.getElementById('minutes').value * 60 * 1000;
        const seconds = document.getElementById('seconds').value * 1000;
        this.startClock(new Date() - hours - minutes - seconds);
    }

    resetClock() {
        if (!window.confirm('Weet je het zeker?')) {
            return;
        }
        this.noSleep.disable();
        clearInterval(this.interval);
        this.interval = undefined;
        this.setState({
            startTime: undefined,
            markers: []
        }, () => {
            localStorage.removeItem('startTime');
            localStorage.removeItem('markers');
        });
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div>
                    {this.state.startTime ? (
                        this.formatTime(this.state.time)
                    ) : (
                        <button type="button" className="btn btn-success btn-lg btn-block"
                                onClick={() => this.startClock(new Date())}>Start Clock</button>
                    )}
                </div>
                <div style={{height: '100%', overflowY: 'scroll'}} id="markers">
                    {this.state.markers.map((marker) => (
                        <div className="input-group flex-nowrap">
                            <div className="input-group-prepend">
                                <span className="input-group-text">{this.formatTime(marker.time)}</span>
                            </div>
                            <input type="text" className="form-control"
                                   aria-describedby="addon-wrapping"
                                   onChange={(event) => this.setMessage(marker.time, event.target.value)}/>
                        </div>
                    ))}
                </div>
                <div>
                    <button type="button" className="btn btn-info btn-lg btn-block" onClick={this.setMarker}>Set
                        Marker
                    </button>
                </div>
                <div>
                    <button type="button" className="btn btn-danger btn-lg btn-block" onClick={this.resetClock}>Reset
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

    formatTime(time) {
        const hours = Math.round(time / 1000 / 60 / 60) % 60;
        const minutes = Math.round(time / 1000 / 60) % 60;
        const seconds = Math.round(time / 1000) % 60;
        return ('0' + hours).substr(-2) + ':' + ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
    }

    setMessage(time, value) {
        const markers = [...this.state.markers];
        markers.find((marker) => marker.time === time).message = value;
        this.setState({
            markers
        }, () => localStorage.setItem('markers', JSON.stringify(markers)));
    }
}

export default App;
