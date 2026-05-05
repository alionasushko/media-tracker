const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const fmtMonthDay = (d: Date) =>
  `${MONTHS[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}`;

export const monthLabels = () => [...MONTHS];

const DAY = 24 * 60 * 60 * 1000;

export const fmtRelativeUpper = (timestamp: number) => {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  if (diff < 60 * 1000) return 'JUST NOW';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} MIN AGO`;
  if (diff < DAY) return `${Math.floor(diff / 3600000)} HR AGO`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)} DAYS AGO`;
  return new Date(timestamp)
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase();
};
