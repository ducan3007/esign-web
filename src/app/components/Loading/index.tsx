import './styles.scss';
export const Loading = () => {
  return (
    <div className="loading">
      <div className="jumping-dots-loader">
        <span></span> <span></span> <span></span>
      </div>
      <div className="moving-gradient"></div>
    </div>
  );
};

export const FallbackLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
      }}
    >
      <Loading />
    </div>
  );
};
