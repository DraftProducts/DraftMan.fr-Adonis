'use strict'

const Model = use('Model')

class PortfolioDetails extends Model {
    static get table () {
        return 'portfolio_details'
    }
    portfolio () {
        return this.belongsTo('App/Models/Portfolio', 'client_project_id', 'id')
    }
}

module.exports = PortfolioDetails