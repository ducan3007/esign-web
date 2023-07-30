import './styles.scss';

export const CircularProcess = (props: any) => {
  return (
    <span className="card" style={{
      marginLeft: '5px',
    }}>
      <span className="percent">
        <svg>
          <circle cx="16" cy="16" r="12"></circle>
          <circle id={props?.id} cx="16" cy="16" r="12" style={{ strokeDashoffset: 'calc(75px - (75px * 0) / 100)' }}></circle>
        </svg>
        <div className="number"></div>
      </span>
    </span>
  );
};
