import slugifyLib from 'slugify';

export const generateSlug = (text: string): string => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const generateInquiryNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `INQ-${year}${month}${day}-${random}`;
};

export const generateSKU = (prefix: string, counter: number): string => {
  return `${prefix.toUpperCase()}-${String(counter).padStart(4, '0')}`;
};

export const parsePagination = (query: { page?: string; limit?: string }) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '12', 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};
