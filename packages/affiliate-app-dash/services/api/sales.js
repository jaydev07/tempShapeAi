import API from './API';

export default {
	influencerSales: (id) =>
		(API().get('/referrals/sales/' + id)),
	influencerSalesUnderManager: (userId) =>
		(API().get('/referrals/sales-count/influencers/' + userId))
}