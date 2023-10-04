import { FormControl, InputLabel, Slider, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

function TimeRange({
  Time,
  setTime,
}: {
  Time: [number, number] | [number];
  setTime: Dispatch<SetStateAction<[number, number] | [number]>>;
}) {
  return (
    <FormControl margin="normal" fullWidth>
      <InputLabel htmlFor="new-recipe-select-Time" shrink>
        Time
      </InputLabel>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          padding: '5px',
        }}
      >
        <Slider
          value={Time}
          onChange={(_, newValue: number | number[]) =>
            setTime(newValue as [number, number] | [number])
          }
          max={200}
          color="secondary"
          valueLabelDisplay="off"
          getAriaValueText={(value: number) => `${value} mins`}
          aria-labelledby="new-recipe-select-Time"
          sx={{
            '& .MuiSlider-thumb': {
              height: '15px',
              width: '15px',
            },
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption">{`${Time[0]} mins`}</Typography>
          <Typography variant="caption">{`${
            Time[1] || Time[0]
          } mins`}</Typography>
        </div>
      </div>
    </FormControl>
  );
}

export default TimeRange;
