export const workshopKeys = {
    all: ['workshop'],
    data: (filters) => [...workshopKeys.all, 'data', filters],
};
