import { useState, useEffect } from 'react';
import config from '@app/config/config';
import { CurrencyTypeEnum } from '@app/interfaces/interfaces';

interface Earning {
  date: number;
  usd_value: number;
}

export const useBitcoinRates = (currency : CurrencyTypeEnum) => {
  const [rates, setRates] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBitcoinRates = async (currency: CurrencyTypeEnum) => {
      try {
        const response = await fetch(`${config.baseURL}/bitcoin-rates/last-30-days/${currency.toLocaleLowerCase()}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok (status: ${response.status})`);
        }
        const data = await response.json();
        setRates(
          data.map((item: { Rate: number; Timestamp: string }) => ({
            date: new Date(item.Timestamp).getTime(),
            usd_value: item.Rate,
          })),
        );
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchBitcoinRates(currency);
  }, []);

  return { rates, isLoading, error };
};
