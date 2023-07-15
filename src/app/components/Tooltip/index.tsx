import { Tooltip, TooltipProps } from '@mui/material';

interface props extends TooltipProps {
  children: any;
}

export const $Tooltip = (props: props) => {
  return (
    <Tooltip
      componentsProps={{
        popper: {
          sx: {
            '& .MuiTooltip-tooltip': {
              backgroundColor: 'var(--white)',
              marginLeft: '1.5rem',
              color: 'var(--ligh-blue3)',
              fontSize: '1.4rem',
              padding: '1.2rem 1.2rem 1.2rem 1.2rem',
              fontWeight: 'bold',
              borderRadius: '5px',
              boxShadow: 'var(--shadow2)',
              border: '1px solid var(--color-gray2)',
            },
          },
        },
      }}
      {...props}
    >
      {props.children}
    </Tooltip>
  );
};
