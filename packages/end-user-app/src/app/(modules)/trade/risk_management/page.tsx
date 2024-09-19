'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import choreMasterAPIAgent from '@/utils/apiAgent'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'

interface ABC {
  a?: string | null
  b?: { b1: string }
}

interface Position {
  account_name: string
  instrument: string
  contract_amount: number
  current_margin: number
  entry_price: number
  initial_margin: number
  liquidation_price: number
  maintenance_margin: number
  margin_ratio: number
  mark_price: number
  max_leverage: number
  percentage_to_liquidation: number
  profit_and_loss: number
  realized_pnl: number
  side: string
  symbol: string
  token_amount: number
  unrealized_pnl: number
}

interface PostPositionsPayload {
  selected_okx_account_names: string[];
}

export default function Page() {
  // react hook states
  const [data, setData] = React.useState<ABC>({ a: null, b: { b1: "sdsddgfdfg" } });
  const [positions, setPositions] = React.useState<Record<string, Position>>({});


  // Function to fetch data from /v1/risk/abc
  const fetchAbc = async () => {
    try {
      await choreMasterAPIAgent.get('/v1/risk/abc', {
        params: {},
        onFail: ({ message }: any) => {
          alert(message);
        },
        onSuccess: async ({ data }: any) => {
          console.log(data);
          setData(data); // Updating the state with fetched data
        },
      });
    } catch (error) {
      console.error('Error fetching /v1/risk/abc', error);
    }
  };

  // Function to fetch positions from /v1/risk/positions
  const fetchPosition = async () => {
    const payload: PostPositionsPayload = {
      selected_okx_account_names: ["okx-data-01"],
    };

    try {
      await choreMasterAPIAgent.post('/v1/risk/positions', payload, {
        onFail: ({ message }: any) => {
          alert(message);
        },
        onSuccess: async (response: any) => {
          // Log the full response to verify its structure
          console.log('Response:', response);
  
          // Check if response has data
          if (response && response.data) {
            const { positions } = response.data;
            console.log('Positions:', positions);
            setPositions(response.data.positions); // Updating the state with positions data
          } else {
            console.error('No data found in response');
          }
        },
      });
    } catch (error) {
      console.error('Error fetching positions', error);
    }
  };

  // Handle click function to fetch /v1/risk/abc when a button is clicked
  const handleClick = async () => {
    await fetchAbc();
    await fetchPosition();
  };

  // useEffect to periodically fetch data every 2 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log('Fetching data periodically');
    }, 60000);

    // Fetch abc data once on component mount
    fetchAbc();
    fetchPosition();

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="risk" />
        <ModuleFunctionBody>
          <Box p={2}>
            <button onClick={handleClick}>Fetch ABC</button>
            {data.a && <div>{data.a}</div>}
            {data.b && <Com color={data.b} another="Optional additional prop" />}


          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="positions table">
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Instrument</TableCell>
                  <TableCell>Account Name</TableCell>
                  <TableCell>Side</TableCell>
                  <TableCell>Leverage</TableCell>
                  <TableCell>Token Amount</TableCell>
                  <TableCell>Contract Amount</TableCell>
                  <TableCell>Entry Price</TableCell>
                  <TableCell>Mark Price</TableCell>
                  <TableCell>Liquidation Price</TableCell>
                  <TableCell>Percentage to Liquidation</TableCell>
                  <TableCell>PnL</TableCell>
                  <TableCell>Realized PnL</TableCell>
                  <TableCell>Unrealized PnL</TableCell>
                  <TableCell>Margin Ratio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {Object.keys(positions).length > 0 ? (
                Object.entries(positions).map(([symbol, position], index) => (
                  <TableRow key={index}>
                    <TableCell>{position.symbol}</TableCell>
                    <TableCell>{position.instrument}</TableCell>
                    <TableCell>{position.account_name}</TableCell>
                    <TableCell>{position.side}</TableCell>
                    <TableCell>{position.max_leverage}</TableCell>
                    <TableCell>{position.token_amount}</TableCell>
                    <TableCell>{position.contract_amount}</TableCell>
                    <TableCell>{position.entry_price}</TableCell>
                    <TableCell>{position.mark_price}</TableCell>
                    <TableCell>{position.liquidation_price}</TableCell>
                    <TableCell>
                      {position.percentage_to_liquidation
                        ? `${(position.percentage_to_liquidation * 100).toFixed(2)}%`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{position.profit_and_loss}</TableCell>
                    <TableCell>{position.realized_pnl}</TableCell>
                    <TableCell>{position.unrealized_pnl}</TableCell>
                    <TableCell>{position.margin_ratio}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} align="center">No positions available</TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </TableContainer>
        </ModuleFunctionBody>
      </ModuleFunction>
    </React.Fragment>
  );
}

// Com component to display color.b1 value
function Com({ color, another }: { color: { b1: string }, another?: string }) {
  return (
    <div>
      <div>Color: {color.b1}</div>
      {another && <div>Another prop: {another}</div>}
    </div>
  );
}
