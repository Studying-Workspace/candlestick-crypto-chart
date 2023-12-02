import "./App.css";
import {useQuery} from "@tanstack/react-query";
import Spinner from "./components/Spinner/Spinner.jsx";
import ChartsBox from "./components/ChartsBox/ChartsBox.jsx";
import {useState} from "react";
import {fetchCandlestickData} from "./services.js";

function App() {
    const [coin, setCoin] = useState('BTC');

    const {isLoading: isSeriesLoading, data: seriesData} = useQuery({
        queryKey: ["price-1m", coin],
        queryFn: async () => {
            return await fetchCandlestickData(coin, '1m');
        },
        refetchInterval: 60 * 1000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
    });

    const {isLoading: isInitialLoading, data: initialData} = useQuery({
        queryKey: ["initial-price", coin],
        queryFn: async () => {
            return await fetchCandlestickData(coin, '1m');
        },
    });

    return (
        <>
            {isSeriesLoading || isInitialLoading ? (
                <Spinner/>
            ) : (
                <ChartsBox
                    seriesData={seriesData}
                    initialData={initialData}
                    isSeriesLoading={isSeriesLoading}
                    isInitialLoading={isInitialLoading}
                    coin={coin}
                    setCoin={setCoin}
                />
            )}
        </>
    );
}

export default App;
