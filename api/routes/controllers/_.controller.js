const _controller = (model, options, query) => {
  let _options = {
    properties: "",
    populate: "",
    popFields: "",
    limit: 12,
    skip: 0
  };
  Object.assign(_options, options);
  return {
    getAll: (
      req,
      res,
      next,
      callback = (err, result) => {
        if (err) return res.status(400).send(err);
        res.status(200).json(result);
      }
    ) => {
      var score = {};
      var sort = {};
      var search = {};
      if (!query && req.query) {
        search = req.query;
      } else {
        search = query;
      }
      if (search.search) {
        // check if index exists else remove 'search' url query data
        if (model.schema._custom && model.schema._custom.textIndex) {
          search["$text"] = { $search: decodeURIComponent(req.query.search) };
          delete search.search;
          score = { score: { $meta: "textScore" } };
          sort = { score: { $meta: "textScore" } };
        } else {
          delete search.search;
        }
      }
      if (search.limit) {
        _options.limit = Number(req.query.limit);
        delete search.limit;
      }
      if (search.skip) {
        _options.skip = Number(req.query.skip);
        delete search.skip;
      }
      model
        .find(search, score)
        .select(_options.properties)
        .sort(sort)
        .skip(_options.skip)
        .limit(_options.limit)
        .populate(_options.populate, _options.popFields)
        .exec((err, result) => {
          if (err) return res.send(err);
          callback(err, result);
        });
    },

    getMeta: (
      req,
      res,
      next,
      callback = (err, result) => {
        if (err) return res.status(400).send(err);
        res.status(200).json(result);
      }
    ) => {
      model.collection.stats((err, result) => {
        let metaData = result;
        delete metaData.wiredTiger;
        delete metaData.indexDetails;

        callback(err, metaData);
      });
    },

    getOne: (
      req,
      res,
      next,
      callback = (err, result) => {
        if (err) return res.status(400).send(err);
        res.status(200).json(result);
      }
    ) => {
      var score = {};
      var sort = {};
      var search = {};
      if (!query && req.query) {
        search = req.query;
      } else {
        search = query;
      }
      if (search.search) {
        // check if index exists else remove 'search' url query data
        if (model.schema._custom && model.schema._custom.textIndex) {
          search["$text"] = { $search: decodeURIComponent(req.query.search) };
          delete search.search;
          score = { score: { $meta: "textScore" } };
          sort = { score: { $meta: "textScore" } };
        } else {
          delete search.search;
        }
      }
      model
        .findOne(search, score)
        .select(_options.properties)
        .sort(sort)
        .populate(_options.populate, _options.popFields)
        .exec((err, result) => {
          if (err) return res.send(err);
          callback(err, result);
        });
    },

    add: (
      req,
      res,
      next,
      callback = (err, result) => {
        if (err) return res.status(400).send(err);
        res.status(200).json(result);
      }
    ) => {
      if (!req.body) return res.status(400).send("No request body found!");
      let data = req.body;
      Object.assign(data, {
        createdBy: req.user._id,
        lastModifiedBy: req.user._id,
        lastModified: new Date()
      });
      model.create(data, (err, result) => {
        callback(err, result);
      });
    },

    remove: (
      req,
      res,
      next,
      callback = (err, result) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(`Successfully Removed ${req.params.shortId}`);
      }
    ) => {
      model.findOne({ _shortId: req.params.shortId }).exec((err, result) => {
        if (err) return res.status(400).send(err);
        if (!result) res.status(200).send(`${req.params.shortId} not found.`);
        model.remove({ _id: result._id }, err => {
          if (err) return res.status(400).send(err);
          callback(err, result);
        });
      });
    },

    update: (
      req,
      res,
      next,
      callback = (err, result) => {
        if (err) return res.status(400).send(err);
        res.status(200).json(result);
      }
    ) => {
      if (!req.body) return res.sendStatus(400);
      let data = req.body;
      Object.assign(data, {
        lastModifiedBy: req.user._id,
        lastModified: new Date()
      });
      model.findOne({ _shortId: req.params.shortId }).exec((err, result) => {
        if (err) return res.status(400).send(err);
        if (!result)
          return res.status(200).send(`${req.params.shortId} not found.`);
        Object.assign(result, data);
        result.save();
      });
    }
  };
};

module.exports = _controller;
