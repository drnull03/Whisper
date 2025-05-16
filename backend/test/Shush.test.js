const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");



describe("SHUSH Contract", function () {
    async function deploySHUSHFixture() {
      const [admin, alice, bob, whisper] = await ethers.getSigners();
      const SHUSH = await ethers.getContractFactory("SHUSH");
      const shush = await SHUSH.deploy();

      await shush.setWhisper(whisper.address);
      return { whisper, admin, alice, bob, shush };
    }








    

    describe("Deployment", function () {
        it("Should set correct initial roles", async function () {
          const { shush, admin } = await loadFixture(deploySHUSHFixture);
          expect(await shush.hasRole(await shush.DEFAULT_ADMIN_ROLE(), admin.address)).to.be.true;
        });
    
        it("Should initialize Whisper contract", async function () {
          const { shush, whisper } = await loadFixture(deploySHUSHFixture);
          expect(await shush.WhisperContract()).to.equal(whisper.address);
        });
      });
  











    

      describe("Claim Mechanism", function () {
        it("Should allow Whisper to mint initial tokens", async function () {
          const { shush, whisper, alice } = await loadFixture(deploySHUSHFixture);
          
          await expect(shush.connect(whisper).claimInitial(alice.address))
            .to.emit(shush, "Claimed")
            .withArgs(alice.address);
    
          expect(await shush.balanceOf(alice)).to.equal(100n * 10n ** 18n);
          expect(await shush.hasClaimed(alice)).to.be.true;
        });
    
        
        
        
        it("Should block non-Whisper from claiming", async function () {
          const { shush, bob, alice } = await loadFixture(deploySHUSHFixture);
          await expect(shush.connect(bob).claimInitial(alice))
            .to.be.revertedWithCustomError(shush, "UrNotWhisper");
        });
      });












      describe("Burn Functionality", function () {
        it("Should allow Whisper to burn tokens", async function () {
          const { shush, whisper, alice } = await loadFixture(deploySHUSHFixture);
          await shush.connect(whisper).claimInitial(alice.address);
          
          const burnAmount = 50n * 10n ** 18n;
          await expect(shush.connect(whisper).burnFrom(alice.address, burnAmount))
            .to.emit(shush, "Burned")
            .withArgs(alice.address, burnAmount);
    
          expect(await shush.balanceOf(alice.address)).to.equal(50n * 10n ** 18n);
        });
    
        it("Should prevent non-Whisper from burning", async function () {
          const { shush, bob, alice } = await loadFixture(deploySHUSHFixture);
          await expect(shush.connect(bob).burnFrom(alice.address, 100))
            .to.be.revertedWithCustomError(shush, "UrNotWhisper");
        });
      });










      describe("Transfer Restrictions", function () {
        it("Should block regular transfers", async function () {
          const { shush, whisper, alice, bob } = await loadFixture(deploySHUSHFixture);
          await shush.connect(whisper).claimInitial(alice.address);
          
          await expect(shush.connect(alice).transfer(bob.address, 100))
            .to.be.revertedWithCustomError(shush, "ShushIsNonTransferable");
        });
    
        it("Should allow minting (zero-address to user)", async function () {
          const { shush, whisper, alice } = await loadFixture(deploySHUSHFixture);
          await expect(shush.connect(whisper).claimInitial(alice.address))
            .to.changeTokenBalance(shush, alice, 100n * 10n ** 18n);
        });
    
        it("Should allow burning (user to zero-address)", async function () {
          const { shush, whisper, alice } = await loadFixture(deploySHUSHFixture);
          await shush.connect(whisper).claimInitial(alice.address);
          
          await expect(shush.connect(whisper).burnFrom(alice.address, 50n * 10n ** 18n))
            .to.changeTokenBalance(shush, alice, -50n * 10n ** 18n);
        });
      });












  describe("Admin Functions", function () {
    it("Should allow admin to pause/unpause", async function () {
      const { shush, admin, whisper, alice } = await loadFixture(deploySHUSHFixture);
      
      await shush.connect(admin).pause();
      await expect(shush.connect(whisper).claimInitial(alice.address))
        .to.be.revertedWithCustomError(shush, "EnforcedPause");

      await shush.connect(admin).unpause();
      await expect(shush.connect(whisper).claimInitial(alice.address))
        .not.to.be.reverted;
    });

    it("Should prevent non-admin from changing Whisper", async function () {
      const { shush, bob } = await loadFixture(deploySHUSHFixture);
      await expect(shush.connect(bob).setWhisper(bob.address))
        .to.be.reverted;
    });
    
    it("Should emit event when Whisper changes", async function () {
      const { shush, admin, bob } = await loadFixture(deploySHUSHFixture);
      await expect(shush.connect(admin).setWhisper(bob.address))
        .to.emit(shush, "WhisperUpdated")
        .withArgs(bob.address);
    });
  });






});