/**
* Copyright 2019 Richard Blondet <https://richardblondet.com>
* 
* @ref https://github.com/strongloop/loopback/issues/1441
*/

// Get the App Roles the roles
var ROLES = require('../ws-roles.json');
// Get the default initial users for the app
var INI_USERS = require('../ws-initial-users.json');

function createUserRolesMigration (app) {
    var Role            = app.models.Role;
    var User            = app.models.user;
    var RoleMapping     = app.models.RoleMapping;
    var DB              = app.dataSources.mongodb;


    try {
      // Create relationship between users and roles
      RoleMapping.belongsTo(User);
      
      // Relationship between user
      User.hasMany( RoleMapping, {
        foreignKey: 'principalId'
      });
    
      // Relationship between role through rolemapping
      Role.hasMany(User, {
        through: RoleMapping, 
        foreignKey: 'roleId'
      });
    
      // migration to asyn/await
      DB.automigrate(async function() {
        
        // create roles
        var roles = await Role.create( ROLES );
        console.log('Roles created: \n', roles);
    
        // create default users
        var users = await User.create( INI_USERS );
        console.log('Users created: \n', users);
        
        // relate users with roles
        Array.prototype.forEach.call( users, async function(user) {
          
          // find role for default user
          var role = await Role.findOne({ where: { name: user.role }});
          console.log("Found role:", role);
          
          // map users and roles
          var roleMapping = await RoleMapping.create({
            principalType: RoleMapping.USER,
            principalId: user.id,
            roleId: role.id
          });
    
          console.log("Role Mapped: ", roleMapping );
        });
      });
    } catch(error) {
      console.log(error);
    }
  
  }
  
  module.exports = createUserRolesMigration;