import { FunctionTool } from 'openai/resources/responses/responses';

export const getTicketPriceDescription: FunctionTool = {
  name: 'getTicketPrice',
  description: `Get the price of a return ticket to the destination city.
                Call this whenever you need to know the ticket price,
                for example when a customer asks 'How much is a ticket to this city'`,
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description: 'The city that the customer wants to travel to',
      },
    },
    required: ['city'],
    additionalProperties: false,
  },
  strict: true,
  type: 'function',
};

export const getTicketPrice = (city: string): string => {
  const prices: Record<string, string> = {
    'new york': '$500',
    'los angeles': '$400',
    chicago: '$300',
    houston: '$350',
    phoenix: '$450',
  };

  return prices[city.toLowerCase()] || 'Unknown city';
};
