import angular from 'angular';
import FileListing from './file-listing';
import DataBrowserService from './data-browser-service';
import ProjectService from './project-service';

let mod = angular.module('portal.data_depot.services', []);

mod.factory('FileListing', FileListing);
mod.factory('DataBrowserService', DataBrowserService);
mod.factory('ProjectService', ProjectService);

export default mod;
