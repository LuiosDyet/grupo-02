const db = require('../database/models');
const Products = require('../services/Products');
const Sales = require('../services/Sales');

const controller = {
    list: async (req, res) => {
        const classes = await Products.findAll();
        res.render('products-page', {
            classes,
        });
    },
    detail: async (req, res) => {
        const idsInCart = [];
        //await Sales.idsInCart(req);
        const classSel = await Products.findOne(req.params.id);
        let inCart = false;

        if (idsInCart && idsInCart.includes(classSel.id)) {
            inCart = true;
        }
        req.session.class = classSel;
        if (!classSel) res.render('not-found');
        res.render('product-detail', {
            classSel,
            id: req.params.id,
            inCart,
        });
    },
    productForm: async (req, res) => {
        let grades = await db.Grade.findAll({ raw: true });
        let subjects = await db.Subject.findAll({ raw: true });
        res.render('product-creation', {
            grades,
            subjects,
        });
    },
    publish: async (req, res) => {
        await Products.create(req);
        req.session.old = null;
        return res.redirect('/success');
    },
    productFormBulk: async (req, res) => {
        let grades = await db.Grade.findAll({ raw: true });
        let subjects = await db.Subject.findAll({ raw: true });
        res.render('product-creation-bulk', {
            grades,
            subjects,
        });
    },
    publishBulk: async (req, res) => {
        await Products.bulkCreate(req);
        res.redirect('/success');
    },
    productFormEdit: async (req, res) => {
        let grades = await db.Grade.findAll({ raw: true });
        let subjects = await db.Subject.findAll({ raw: true });
        let classSel = await Products.findOne(req.params.id);
        res.render('product-creation', {
            old: classSel,
            grades,
            subjects,
        });
    },
    productFormUpdate: async (req, res) => {
        req.session.old = req.session.class;
        await Products.edit(req);
        req.session.old = null;
        return res.redirect('/success');
    },
    delete: async (req, res) => {
        let old = req.session.old || req.session.class;
        await Products.delete(old);
        req.session.old = null;
        res.redirect('/');
    },
    duplicate: async (req, res) => {
        await Products.create(req);
        req.session.old = null;
        return res.redirect('/success');
    },
    search: async (req, res) => {
        const searchItem = req.query.search;
        const classes = await Products.searchProduct(searchItem);
        res.render('products-page', {
            classes,
        });
    },
};

module.exports = controller;
