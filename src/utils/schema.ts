import joi from 'joi';
import moment from 'moment';

export  = {
    token: joi.object({
        token: joi.string().min(100).required()
    }).options({allowUnknown:true}),
    newDonate: joi.object({     
        amount: joi.number().min(0).max(10000).required()
    }).options({allowUnknown:true}),
    newWalk:joi.object({     
        steps: joi.number().required()
    }).options({allowUnknown:true}),
    newHelp:joi.object({    
        startTime: joi.date().required(),
        endTime:joi.date().required()
    }).options({allowUnknown:true}),
    deleteHelp:joi.object({    
        id: joi.string().required().max(30)
    }).options({allowUnknown:true}),
    newNews:joi.object({
        title: joi.string().max(100).required(),
        description: joi.string().required().max(500)
    }).options({allowUnknown:true}),
    newSurvey:joi.object({
        answers:joi.object().required()
    }).options({allowUnknown:true}),
    acceptSurvey:joi.object({   
        id: joi.string().required().max(30)
    }).options({allowUnknown:true}),
    edit:joi.object({
        id:joi.string().max(30).required(),
        name:joi.string().max(30).required(),
        category:joi.string().max(30).required(),
        description:joi.string().max(500).required(),
        age:joi.number().required().max(30)
    }).options({allowUnknown:true}),
    delete:joi.object({
        id:joi.string().max(30).required()
    }).options({allowUnknown:true})
}