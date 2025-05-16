const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Whisper Contract", function () {
  async function deployContractsFixture() {
    const [admin, user1, user2, reporter] = await ethers.getSigners();

    // 1. Deploy SHUSH Token
    const SHUSH = await ethers.getContractFactory("SHUSH");
    const shush = await SHUSH.deploy();

    // 2. Deploy Whisper with SHUSH address
    const Whisper = await ethers.getContractFactory("contracts/WhisperV3.sol:Whisper");
    const whisper = await Whisper.deploy(shush.getAddress());

    // 3. Set Whisper contract in SHUSH
    await shush.setWhisper(await whisper.getAddress());

    return { shush, whisper, admin, user1, user2, reporter };
  }

  describe("User Registration", () => {
    it("Should register new user with valid details", async () => {
      const { whisper, shush, user1 } = await loadFixture(deployContractsFixture);
      
      await expect(whisper.connect(user1).registerUser("alice", "pubkey123"))
        .to.emit(whisper, "RegisteredNewUser")
        .withArgs("alice");

      // Verify SHUSH balance after claim
      expect(await shush.balanceOf(user1.address)).to.equal(100n * 10n ** 18n);
    });
    
    it("Should prevent duplicate name registration", async () => {
      const { whisper, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await whisper.connect(user1).registerUser("alice", "pubkey123");
      await expect(whisper.connect(user2).registerUser("alice", "pubkey456"))
        .to.be.revertedWithCustomError(whisper, "NameTaken");
    });
    
    it("Should block empty name registration", async () => {
      const { whisper, user1 } = await loadFixture(deployContractsFixture);
      
      await expect(whisper.connect(user1).registerUser("", "pubkey123"))
        .to.be.revertedWithCustomError(whisper, "EmptyStringNotAllowed")
        .withArgs("Name Field");
    });
  });

  describe("Email Functionality", () => {
    async function registeredUsersFixture() {
      const fix = await deployContractsFixture();
      await fix.whisper.connect(fix.user1).registerUser("alice", "pubkey123");
      await fix.whisper.connect(fix.user2).registerUser("bob", "pubkey456");
      return fix;
    }

    it("Should send email between registered users", async () => {
      const { whisper, user1, user2 } = await loadFixture(registeredUsersFixture);
      
      await expect(whisper.connect(user1).sendEmail("alice", "bob", "QmHash123"))
        .to.emit(whisper, "EmailSent")
        .withArgs("alice", "bob");

      // Verify inbox updates
      const inbox = await whisper.connect(user2).getInbox();
      expect(inbox[0].ipfsCID).to.equal("QmHash123");
    });
    
    it("Should prevent sending from unowned domain", async () => {
      const { whisper, user1 } = await loadFixture(registeredUsersFixture);
      
      await expect(whisper.connect(user1).sendEmail("bob", "alice", "QmHash123"))
        .to.be.revertedWithCustomError(whisper, "NotOwnerOfSendningDomain")
        .withArgs("bob");
    });
    
    it("Should block sending to non-existent users", async () => {
      const { whisper, user1 } = await loadFixture(registeredUsersFixture);
      
      await expect(whisper.connect(user1).sendEmail("alice", "charlie", "QmHash123"))
        .to.be.revertedWithCustomError(whisper, "UserDoesNotExist");
    });
  });

  describe("Spam Reporting", () => {
    async function reportedSpamFixture() {
      const fix = await deployContractsFixture();
      await fix.whisper.connect(fix.user1).registerUser("spammer", "pubkey123");
      await fix.whisper.connect(fix.reporter).registerUser("reporter", "pubkey456");
      return fix;
    }

    it("Should process valid spam report", async () => {
      const { whisper, shush, user1, reporter } = await loadFixture(reportedSpamFixture);
      
      const initialReporterBalance = await shush.balanceOf(reporter.address);
      await expect(whisper.connect(reporter).reportSpam("spammer"))
        .to.emit(whisper, "SpamReported")
        .withArgs("spammer");

      // Verify token burns
      expect(await shush.balanceOf(reporter.address))
        .to.equal(initialReporterBalance - (5n * 10n ** 18n));
      expect(await shush.balanceOf(user1.address))
        .to.equal(100n * 10n ** 18n - (10n * 10n ** 18n));
    });
  });

  describe("Encryption Keys", () => {
    it("Should update public key properly", async () => {
      const { whisper, user1 } = await loadFixture(deployContractsFixture);
      await whisper.connect(user1).registerUser("alice", "oldkey");
      
      await expect(whisper.connect(user1).updateEncryptionKey("newkey", "alice"))
        .to.emit(whisper, "EncryptionKeyUpdated")
        .withArgs(user1.address, "newkey");

      expect(await whisper.getPublicKeyOf("alice")).to.equal("newkey");
    });
  });

  describe("Access Control", () => {
    it("Should pause/unpause system", async () => {
      const { whisper, admin, user1 } = await loadFixture(deployContractsFixture);
      
      await whisper.connect(admin).pause();
      await expect(whisper.connect(user1).registerUser("alice", "pubkey123"))
        .to.be.revertedWithCustomError(whisper, "EnforcedPause");

      await whisper.connect(admin).unpause();
      await expect(whisper.connect(user1).registerUser("alice", "pubkey123"))
        .not.to.be.reverted;
    });
  });
});