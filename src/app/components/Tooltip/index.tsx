import { Tooltip, TooltipProps } from '@mui/material';

interface props extends TooltipProps {
  children: any;
  fontSize?: string;
  padding?: string;
  background?: string;
  color?: string;
  fontWeight?: string;
  margin?: string;
  nowrap?: any;
}

export const MTooltip = (props: props) => {
  return (
    <Tooltip
      componentsProps={{
        popper: {
          sx: {
            '& .MuiTooltip-tooltip': {
              backgroundColor: props.background || 'var(--white)',
              margin: props.margin || '0px 0px 0px 1.5rem',
              color: props.color || 'var(--ligh-blue3)',
              fontSize: props.fontSize || '1.4rem',
              fontWeight: props.fontWeight || 'bold',
              borderRadius: '5px',
              boxShadow: 'var(--shadow2)',
              border: '1px solid var(--color-gray2)',
              whiteSpace: props.nowrap || 'nowrap',
              overflow: 'hidden',
            },
          },
        },
      }}
      PopperProps={{
        disablePortal: true,
        sx: {
          overflow: 'hidden',
        },
      }}
      {...props}
    >
      {props.children}
    </Tooltip>
  );
};
