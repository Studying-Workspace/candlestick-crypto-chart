import React, {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";
import {updateCandlestick, accumulateFromBatch} from "../../../utilities.js";

export const CandlestickChart = ({data, initialData}) => {

    let processData = (rawData) => {
        const processedData = [];
        for(let i = 0; i < rawData.length; i += 20) {
            processedData.push(accumulateFromBatch(rawData, i, 20));
        }
        return processedData;
    }

    const [series, setSeries] = useState([
        {
            name: "series-1",
            // array of objects with x and y properties
            // {x: new Date(1991, 0, 1), y: [30, 40, 45, 50]},
            data: processData(initialData).map((item) => {
                return {
                    x: new Date(item[0]),
                    y: [...item.slice(1)]
                }
            })
        }
    ]);

    // chart: open - high - low - close
    // api: timestamp - low - high - open - close - _volume
    useEffect(() => {
        let newSeries = [...series];
        newSeries[0].data.push({x: new Date(), y: []});
        if (newSeries[0]?.data.length > 60) {
            newSeries[0].data.unshift();
        }
        setSeries(newSeries);
        updateCandlestick([...series], setSeries, [...data]);
    }, [data]);


    return (
        <div className="app">
            <div className="row">
                <div className="mixed-chart">
                    <ReactApexChart
                        options={{
                            chart: {
                                id: "basic-bar"
                            },
                            xaxis: {
                                categories: [] // empty array
                            }
                        }}
                        series={series}
                        type="candlestick" // change type to candlestick
                        width="500"
                    />
                </div>
            </div>
        </div>
    );
}

