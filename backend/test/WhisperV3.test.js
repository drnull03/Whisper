const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Whisper Contract", function () {
  async function deployContractsFixture() {
    const [admin, user1, user2,user3, reporter] = await ethers.getSigners();

    // 1. Deploy SHUSH Token
    const SHUSH = await ethers.getContractFactory("SHUSH");
    const shush = await SHUSH.deploy();

    // 2. Deploy Whisper with SHUSH address
    const Whisper = await ethers.getContractFactory("contracts/WhisperV3.sol:Whisper");
    const whisper = await Whisper.deploy(shush.getAddress());

    // 3. Set Whisper contract in SHUSH
    await shush.setWhisper(await whisper.getAddress());

    return { shush, whisper, admin, user1, user2, reporter ,user3};
  }


  async function registeredUsersFixture() {
    const fix = await deployContractsFixture();
    await fix.whisper.connect(fix.user1).registerUser("alice", "pubkey1");
    await fix.whisper.connect(fix.user2).registerUser("bob", "pubkey2");
    await fix.whisper.connect(fix.user3).registerUser("charlie","pubkey2");
    return fix;
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
      
      await expect(whisper.connect(user1).sendEmail("alice", "mohmad", "QmHash123"))
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

//more testing


describe("Extended Registration Tests", () => {
    it("Should register with maximum length name (1000 chars)", async () => {
      const { whisper, user1 } = await loadFixture(deployContractsFixture);
      const longName = "a".repeat(1000);
      await expect(whisper.connect(user1).registerUser(longName, "pubkey"))
        .to.emit(whisper, "RegisteredNewUser");
    });

    it("Should register with special characters in name", async () => {
      const { whisper, user1 } = await loadFixture(deployContractsFixture);
      const specialName = "!@#$%^&*()_+-=[]{}|;':,./<>?~`";
      await expect(whisper.connect(user1).registerUser(specialName, "pubkey"))
        .to.emit(whisper, "RegisteredNewUser");
    });

    it("Should prevent registration without SHUSH setup", async () => {
      const [admin, user1] = await ethers.getSigners();
      const SHUSH = await ethers.getContractFactory("SHUSH");
      const shush = await SHUSH.deploy();
      const Whisper = await ethers.getContractFactory("contracts/WhisperV3.sol:Whisper");
      const whisper = await Whisper.deploy(shush.getAddress());
      
      await expect(whisper.connect(user1).registerUser("alice", "pubkey"))
        .to.be.revertedWithCustomError(shush, "UrNotWhisper");
    });
  });



  //advanced email test


  describe("Advanced Email Tests", () => {
    it("Should handle 100 emails in inbox", async () => {
        
      const { whisper, user1, user2 } = await loadFixture(registeredUsersFixture);
      
      for (let i = 0; i < 100; i++) {
        await whisper.connect(user1).sendEmail("alice", "bob", `CID${i}`);
      }

      const inbox = await whisper.connect(user2).getInbox();
      expect(inbox.length).to.equal(100);
      expect(inbox[99].ipfsCID).to.equal("CID99");
    });

    it("Should maintain separate inboxes for different users", async () => {
      const { whisper, user1, user2, user3 } = await loadFixture(registeredUsersFixture);
      
      await whisper.connect(user1).sendEmail("alice", "bob", "CID1");
      await whisper.connect(user2).sendEmail("bob", "charlie", "CID2");

      const bobInbox = await whisper.connect(user2).getInbox();
      const charlieInbox = await whisper.connect(user3).getInbox();
      
      expect(bobInbox.length).to.equal(1);
      expect(charlieInbox.length).to.equal(1);
    });

    it("Should enforce minimum balance on recipient", async () => {
      const { whisper, shush, user1, user2 } = await loadFixture(registeredUsersFixture);
      
      // Burn bob's tokens below minimum
      //await shush.connect(whisper).burnFrom(user2.address, 70n * 10n ** 18n);
      for(i=0;i<7;i++){
      await whisper.connect(user1).reportSpam("bob");
      }
      
      await expect(await shush.balanceOf(user2)).to.equal(30n * 10n ** 18n);
      await expect(await shush.balanceOf(user1)).to.equal(65n * 10n ** 18n);
      
      await expect(whisper.connect(user2).sendEmail("bob", "alice", "CID"))
        .to.be.revertedWithCustomError(whisper, "SpammerSendingNotAllowed");
    });

    it("Should allow sending to recipient with exact minimum balance", async () => {
      const { whisper, shush, user1, user2 } = await loadFixture(registeredUsersFixture);
      for(i=0;i<6;i++){
        await whisper.connect(user1).reportSpam("bob");
        }
      await expect(await shush.balanceOf(user2)).to.equal(40n * 10n ** 18n);
      await expect(await shush.balanceOf(user1)).to.equal(70n * 10n ** 18n);
      
      
      await expect(whisper.connect(user2).sendEmail("bob", "alice", "CID"))
        .to.emit(whisper, "EmailSent");
    });
  });





  

  describe("Spam Reporting Edge Cases", () => {
    it("Should fail reporting non-existent user", async () => {
      const { whisper, reporter } = await loadFixture(registeredUsersFixture);
      await expect(whisper.connect(reporter).reportSpam("nonexistent"))
        .to.be.revertedWithCustomError(whisper , "UserDoesNotExist");
    });
    
   

   
  });





  describe("Security and Access Control", () => {
    it("Should prevent non-admin from granting roles", async () => {
      const { whisper, user1, user2 } = await loadFixture(deployContractsFixture);
      
      await expect(
        whisper.connect(user1).grantRole(ethers.id("WHISPER_ADMIN"), user2.address)
      ).to.be.reverted;
    });

    it("Should allow admin transfer", async () => {
      const { whisper, admin, user1 } = await loadFixture(deployContractsFixture);
      
      await whisper.connect(admin).grantRole(await whisper.DEFAULT_ADMIN_ROLE(), user1.address);
      await whisper.connect(admin).renounceRole(await whisper.DEFAULT_ADMIN_ROLE(), admin.address);
      
      await expect(whisper.connect(user1).pause())
        .not.to.be.reverted;
    });
  });



  describe("State Management", () => {
    it("Should clear and repopulate sent items", async () => {
      const { whisper, user1, user2 } = await loadFixture(registeredUsersFixture);
      
      await whisper.connect(user1).sendEmail("alice", "bob", "CID1");
      await whisper.connect(user1).clearSent();
      
      let sent = await whisper.connect(user1).getSent();
      expect(sent.length).to.equal(0);
      
      await whisper.connect(user1).sendEmail("alice", "bob", "CID2");
      sent = await whisper.connect(user1).getSent();
      expect(sent.length).to.equal(1);
    });

    it("Should maintain state after unpausing", async () => {
      const { whisper, admin, user1 } = await loadFixture(registeredUsersFixture);
      
      await whisper.connect(admin).pause();
      await whisper.connect(admin).unpause();
      
      await expect(whisper.connect(user1).sendEmail("alice", "bob", "CID"))
        .to.emit(whisper, "EmailSent");
    });
  });



  describe("Data Integrity", () => {
    it("Should store accurate timestamps", async () => {
      const { whisper, user1, user2 } = await loadFixture(registeredUsersFixture);
      
      const blockNumber = await ethers.provider.getBlockNumber();
      const tx = await whisper.connect(user1).sendEmail("alice", "bob", "CID");
      
      //const tx = await whisper.connect(user1).sendEmail("alice", "bob", "CID");
      const block = await ethers.provider.getBlock(tx.blockNumber);
      
      const inbox = await whisper.connect(user2).getInbox();
      expect(inbox[0].timestamp).to.equal(block.timestamp);
    });

    it("Should maintain encryption key integrity", async () => {
      const { whisper, user1 } = await loadFixture(registeredUsersFixture);
      
      const newKey = "new_pubkey_12345";
      await whisper.connect(user1).updateEncryptionKey(newKey, "alice");
      
      const storedKey = await whisper.getPublicKeyOf("alice");
      expect(storedKey).to.equal(newKey);
    });
  });





});