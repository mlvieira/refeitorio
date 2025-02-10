import XXH from 'xxhashjs';

const HashData = (data) => XXH.h32(JSON.stringify(data), 0xabcd).toString(16);

export default HashData;
