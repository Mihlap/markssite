const Grid = ({ children, columns }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        rowGap: 32,
        columnGap: 16,
        marginTop: 32,
      }}>
      {children}
    </div>
  );
};

export default Grid;
