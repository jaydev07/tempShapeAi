import { ApolloError } from 'apollo-server-errors';
import puppeteer from 'puppeteer';
import { unique } from 'shorthash';
import Module from '../../../database/models/module';
import ModuleTracker from '../../../database/models/module-tracker';
import UserCertificate from '../../../database/models/user-certificate';
import certTemplates from '../../../cert-generator/templates';


import { Types } from 'mongoose';
import { uploadToS3PM } from '../../../services/aws';
import User from '../../../database/models/user';
import { genCert } from '../../../cert-generator';

export default async (parent, { moduleId }, { user }) => {
  try {
    const module = await Module.findOne({
      _id: Types.ObjectId(moduleId),
      isCertificateAvailable: true,
    }).populate("certificateTemplate");
    if (!module)
      throw new ApolloError("Module doesn't contain cert", "MODULE_ERR");
    const moduleTracker = await ModuleTracker.findOne({
      module: module._id,
      user: user._id,
    });
    if (!moduleTracker)
      throw new ApolloError("User not enrolled in module", "TRACKER_ERR");
    if (moduleTracker.percentageCompleted < 100)
      throw new ApolloError("User has not completed the module", "TRACKER_ERR");

    const { certificateTemplate } = module;
    const credentialId = unique(`${user._id}-${moduleId}`);
    let certificate = await UserCertificate.findOne({
      credentialId,
    });
    if (!certificate)
      certificate = await UserCertificate.create({
        user: user._id,
        credentialId,
        template: certificateTemplate._id,
        course: module.course,
        accomplishmentType: "module",
        module: moduleId,
      });
    certificate = await genCert(certificateTemplate, certificate, credentialId, user, 'module');
    await ModuleTracker.findByIdAndUpdate(moduleTracker._id, {
      certificateGenerated: true,
      certificate: certificate._id,
    });
    return certificate;
  } catch (e) {
    console.log(e);
    throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
  }
};
