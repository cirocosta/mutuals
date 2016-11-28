module.exports = function(deployer) {
    deployer.deploy(Token);
    deployer.deploy(People);
    deployer.autolink();
    deployer.deploy(Claim);
    deployer.deploy(Insured);
    deployer.deploy(Mutuals);
};
