import { format, parseISO } from 'date-fns';
import { kk } from 'date-fns/locale';

export const formatCurrency = (amount, currency = '₸') => {
  return new Intl.NumberFormat('kk-KZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount) + ` ${currency}`;
};

export const formatDate = (dateString, formatStr = 'dd.MM.yyyy') => {
  try {
    return format(parseISO(dateString), formatStr, { locale: kk });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, 'dd.MM.yyyy HH:mm');
};

export const formatRelativeTime = (dateString) => {
  const date = parseISO(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Жаңағы';
  if (diffMins < 60) return `${diffMins} мин бұрын`;
  if (diffHours < 24) return `${diffHours} сағ бұрын`;
  if (diffDays < 7) return `${diffDays} күн бұрын`;
  return formatDate(dateString);
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const generateColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#3498DB', '#2ECC71', '#E74C3C', '#F39C12',
    '#9B59B6', '#1ABC9C', '#34495E', '#E67E22'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};
