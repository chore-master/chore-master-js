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
  current_margin: number | null
  entry_price: number
  initial_margin: number
  liquidation_price: number | null
  maintenance_margin: number
  margin_ratio: number | null
  mark_price: number
  max_leverage: number | null
  percentage_to_liquidation: number | null
  profit_and_loss: number
  realized_pnl: number
  side: string
  symbol: string
  token_amount: number
  unrealized_pnl: number
}

interface FxRisk {
  symbol: string
  instrument: string
  base_currency: string
  quote_currency: string
  account_name: string
  side: string
  token_amount: number
  delta: number
  gamma: number
  vega: number
  theta: number
}

interface IrRisk {
  symbol: string
  base_currency: string
  quote_currency: string
  account_name: string
  side: string
  token_amount: number
  dv01: number
  rho: number
}

interface PostPositionsPayload {
  selected_okx_account_names: string[];
}

export default function Page() {
  // react hook states
  const [data, setData] = React.useState<ABC>({ a: null, b: { b1: "sdsddgfdfg" } });
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [fxRisk, setFxRisk] = React.useState<FxRisk[]>([]);
  const [irRisk, setIrRisk] = React.useState<IrRisk[]>([]);

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
      selected_okx_account_names: ["okx-data-01", "okx_term_futures"],
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

  // Function to fetch positions from /v1/risk/positions
  const fetchPositionFxRisk = async () => {
    const payload: PostPositionsPayload = {
      selected_okx_account_names: ["okx-data-01", "okx_term_futures"],
    };

    try {
      await choreMasterAPIAgent.post('/v1/risk/fxrisk', payload, {
        onFail: ({ message }: any) => {
          alert(message);
        },
        onSuccess: async (response: any) => {
          // Log the full response to verify its structure
          console.log('Response:', response);
  
          // Check if response has data
          if (response && response.data) {
            const { fxRisk } = response.data;
            console.log('Fx Risk:', fxRisk);
            setFxRisk(response.data.positions_fx_risk); // Updating the state with positions data
          } else {
            console.error('No data found in response');
          }
        },
      });
    } catch (error) {
      console.error('Error fetching positions', error);
    }
  };

// Function to fetch positions from /v1/risk/positions
const fetchPositionIrRisk = async () => {
  const payload: PostPositionsPayload = {
    selected_okx_account_names: ["okx-data-01", "okx_term_futures"],
  };

  try {
    await choreMasterAPIAgent.post('/v1/risk/irrisk', payload, {
      onFail: ({ message }: any) => {
        alert(message);
      },
      onSuccess: async (response: any) => {
        // Log the full response to verify its structure
        console.log('Response:', response);

        // Check if response has data
        if (response && response.data) {
          const { irRisk } = response.data;
          console.log('Ir Risk:', irRisk);
          setIrRisk(response.data.positions_ir_risk); // Updating the state with positions data
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
    await fetchPositionFxRisk();
    await fetchPositionIrRisk();
  };

  // useEffect to periodically fetch data every 2 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log('Fetching data periodically');
    }, 60000);

    // Fetch abc data once on component mount
    fetchAbc();
    fetchPosition();
    fetchPositionFxRisk();
    fetchPositionIrRisk();

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  return (
    <React.Fragment>
      <ModuleFunction>
        <ModuleFunctionHeader title="風險監控" />
        {/*<ModuleFunctionBody>
          <Box p={2}>
            <button onClick={handleClick}>Fetch ABC</button>
            {data.a && <div>{data.a}</div>}
            {data.b && <Com color={data.b} another="Optional additional prop" />}
          </Box>
        </ModuleFunctionBody>*/}
        <ModuleFunctionBody>
          <ModuleFunctionHeader title="Positions" />
          <Box p={2}>
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
                  {positions.length > 0 ? (
                    positions.map((position, index) => (
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
          </Box>
        </ModuleFunctionBody>
        <ModuleFunctionBody>
          <ModuleFunctionHeader title="FX Risk" />
          <Box p={0}>
            <TableContainer component={Paper}>
              <Table aria-label="positions_fx_risk">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Instrument</TableCell>
                    <TableCell>Base Currency</TableCell>
                    <TableCell>Quote Currency</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell>Side</TableCell>
                    <TableCell>Token Amount</TableCell>
                    <TableCell>Delta</TableCell>
                    <TableCell>Gamma</TableCell>
                    <TableCell>Vega</TableCell>
                    <TableCell>Theta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fxRisk.length > 0 ? (
                    fxRisk.map((fxRisk, index) => (
                      <TableRow key={index}>
                        <TableCell>{fxRisk.symbol}</TableCell>
                        <TableCell>{fxRisk.instrument}</TableCell>
                        <TableCell>{fxRisk.base_currency}</TableCell>
                        <TableCell>{fxRisk.quote_currency}</TableCell>
                        <TableCell>{fxRisk.account_name}</TableCell>
                        <TableCell>{fxRisk.side}</TableCell>
                        <TableCell>{fxRisk.token_amount}</TableCell>
                        <TableCell>{fxRisk.delta}</TableCell>
                        <TableCell>{fxRisk.gamma}</TableCell>
                        <TableCell>{fxRisk.vega}</TableCell>
                        <TableCell>{fxRisk.theta}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} align="center">No positions FX Risk Available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </ModuleFunctionBody>
        <ModuleFunctionBody>
          <ModuleFunctionHeader title="IR Risk" />
          <Box p={0}>
            <TableContainer component={Paper}>
              <Table aria-label="positions_ir_risk">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Base Currency</TableCell>
                    <TableCell>Quote Currency</TableCell>
                    <TableCell>Account Name</TableCell>
                    <TableCell>Side</TableCell>
                    <TableCell>Token Amount</TableCell>
                    <TableCell>DV01</TableCell>
                    <TableCell>Rho</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {irRisk.length > 0 ? (
                    irRisk.map((irRisk, index) => (
                      <TableRow key={index}>
                        <TableCell>{irRisk.symbol}</TableCell>
                        <TableCell>{irRisk.base_currency}</TableCell>
                        <TableCell>{irRisk.quote_currency}</TableCell>
                        <TableCell>{irRisk.account_name}</TableCell>
                        <TableCell>{irRisk.side}</TableCell>
                        <TableCell>{irRisk.token_amount}</TableCell>
                        <TableCell>{irRisk.dv01}</TableCell>
                        <TableCell>{irRisk.rho}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} align="center">No positions IR Risk Available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
