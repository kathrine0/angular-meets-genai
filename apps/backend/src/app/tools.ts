import { ChatCompletionTool } from 'openai/resources/chat/completions';

export const getTicketPriceDescription: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'getTicketPrice',
    description: `Gets the price of a return ticket to a destination city.
                ALWAYS use this function when asked about ticket prices.
                Call this whenever you need to know the ticket price,
                for example when a customer asks 'How much is a ticket to this city'`,
    parameters: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'The destination city name (e.g., "New York", "Chicago")',
        },
      },
      required: ['city'],
      additionalProperties: false,
    },
    strict: true,
  },
};

export const getTicketPrice = (city: string): string => {
  const prices: Record<string, string> = {
    'new york': '$500',
    'nowy jork': '$500',
    'los angeles': '$400',
    chicago: '$300',
    houston: '$350',
    phoenix: '$450',
  };

  return prices[city.toLowerCase()] || 'Unknown city';
};
