export function summarizeFrames(frames: readonly number[]) {
  const valid=frames.filter(value=>Number.isFinite(value)&&value>0);
  if(!valid.length) return {fps:0,p95ms:0};
  const sorted=[...valid].sort((a,b)=>a-b);
  return {fps:valid.length*1000/valid.reduce((sum,value)=>sum+value,0),p95ms:sorted[Math.ceil(sorted.length*.95)-1]};
}

