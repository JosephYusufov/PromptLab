import Intent from "../models/intent.model.js";
import Prompt from "../models/prompt.model.js";
import Comment from "../models/comment.model.js"
import errorHandler from "../helpers/dbErrorHandler.js";
import userCtrl from "./user.controller.js"
import DbErrorHandler from "../helpers/dbErrorHandler.js";


/**
 * Retrieve a comment by its ID and append it to the req
 * @param req
 * @param res
 * @param next
 * @param id
 * @returns {Promise<void>}
 */
const commentById = async (req, res, next, id) => {

    try {

        let comment = await Comment.findById(id)

        console.log(comment);

        if (!comment)
            return res.status(400).json({
                error: "Intent not found",
            });

        req.comment = comment;
        next();
    } catch (err) {
        return res.status(400).json({
            error: DbErrorHandler.getErrorMessage(err)
        })
    }
}

/**
 * Create comment based on req information
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const create = async (req, res) => {

    let user = req.auth;

    if (!req.intent)
        return res.status(400).json({
            message: 'An intent is required in the request'
        })

    const intent = req.intent;

    const owner_id = intent.user;
    const owner = await userCtrl.returnUser(owner_id)

    if (!owner) {
        res.json('Owner not found in database!')
    }

    if (!owner.is_pro) {
        return res.status(400).json({
            message: 'Owner must be pro to create comments'
        })
    }

    let comment = new Comment({...req.body, intent: intent, user: user._id})

    try {
        await comment.save();
        return res.status(200).json({
            message: 'Successfully created a new Comment'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }

}

/**
 * Creates a comment in the form of a reply given a parent comment and an intent
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const createReply = async (req, res) => {
    if (!req.comment)
        return res.status(400).json({
            message: "Must have a parent comment in the request"
        })

    if (!req.intent)
        return res.status(400).json({
            message: "Must have an intent in the request"
        })

    const intent = req.intent;
    const parent = req.comment;
    const user = req.auth;

    const comment = new Comment({...req.body, intent: intent._id, parent: parent._id, user: user._id})

    try {
        await comment.save()
        parent.children.push(comment._id)
        parent.save();

        return res.status(200).json({
            message: "Comment Created and Parent Associated"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }

}

/**
 * Read a comment
 * @param req
 * @param res
 */
const read = (req, res) => {
    return res.json(req.intent)
}

/**
 * List all comments associated with an intent
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const list = async (req, res) => {

    let intent = req.intent;

    try {
        let comments = await Comment.find({intent: intent._id})

        res.json({comments})
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default {
    commentById,
    create,
    list,
    read,
    createReply
}