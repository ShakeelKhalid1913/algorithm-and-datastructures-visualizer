import { memo } from 'react';
import { Handle } from 'reactflow';

const ArrayNode = memo(({ data }) => {
  const style = {
    padding: '15px',
    borderRadius: '8px',
    border: '3px solid',
    borderColor: data.isTarget ? '#4caf50' : 
                data.isHighlighted ? '#2196f3' : 
                data.isBoundary ? '#ff9800' :
                data.isComparing ? '#e91e63' :
                data.isSorted ? '#4caf50' : '#ddd',
    background: data.isTarget ? '#c8e6c9' : 
                data.isHighlighted ? '#e3f2fd' : 
                data.isBoundary ? '#fff3e0' :
                data.isComparing ? '#fce4ec' :
                data.isSorted ? '#f1f8e9' : 'white',
    color: '#000000',
    transition: 'all 0.3s ease',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold'
  };

  return (
    <div style={style}>
      <Handle type="target" position="top" style={{ visibility: 'hidden' }} />
      {data.label}
      <Handle type="source" position="bottom" style={{ visibility: 'hidden' }} />
    </div>
  );
});

export default ArrayNode;
