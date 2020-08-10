import React from "react";

const Menu = ({stopwatches, goToTime, deleteTime, makeNewTime}) => (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div>
            Stopwatches:
        </div>
        <div style={{height: '100%', overflowY: 'scroll'}}>
        {stopwatches.map((stopwatch) => (
            <div className="btn-group btn-block" key={stopwatch.time}>
                <button type="button" className="btn btn-info btn-secondary"
                        onClick={() => goToTime(stopwatch.time)}>Started at {new Date(stopwatch.time).toLocaleTimeString()}</button>
                <button type="button" className="btn btn-danger btn-secondary"
                        onClick={() => deleteTime(stopwatch.time)}>Delete
                </button>
            </div>
        ))}
            </div>
        <div>
            <button type="button" className="btn btn-info btn-lg btn-block" onClick={makeNewTime}>
                Make new Stopwatch
            </button>
        </div>
    </div>
);

export default Menu;
