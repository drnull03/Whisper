const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Whisper Contract", function () {
  async function deployWhisperFixture() {
    const [admin, alice, bob, charlie] = await ethers.getSigners();
    const Whisper = await ethers.getContractFactory("contracts/WhisperV2.sol:Whisper");
    const whisper = await Whisper.deploy();
    return { whisper, admin, alice, bob, charlie };
  }

  describe("User Registration", function () {
    
    it("Should allow multiple unique registrations", async function () {
      const { whisper, alice, bob } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser("alice", "pk1");
      await whisper.connect(bob).registerUser("bob", "pk2");
      
      const aliceKey = await whisper.getPublicKeyOf("alice");
      const bobKey = await whisper.getPublicKeyOf("bob");
      expect(aliceKey).to.equal("pk1");
      expect(bobKey).to.equal("pk2");
    });

    it("Should prevent registration with existing name (case sensitive)", async function () {
      const { whisper, alice, bob } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser("Alice", "pk1");
      await expect(whisper.connect(bob).registerUser("Alice", "pk2"))
        .to.be.revertedWithCustomError(whisper, "NameTaken");
    });
  });

  describe("Email Functionality", function () {
    it("Should store email in both sender's sent and recipient's inbox", async function () {
      const { whisper, alice, bob } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser("alice", "pk1");
      await whisper.connect(bob).registerUser("bob", "pk2");

      await whisper.connect(alice).sendEmail("alice", "bob", "cid123");

      const aliceSent = await whisper.connect(alice).getSent();
      const bobInbox = await whisper.connect(bob).getInbox();

      expect(aliceSent[0].ipfsCID).to.equal("cid123");
      expect(bobInbox[0].ipfsCID).to.equal("cid123");
    });

    it("Should allow sending email to self", async function () {
      const { whisper, alice } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser("alice", "pk1");

      await expect(whisper.connect(alice).sendEmail("alice", "alice", "self-cid"))
        .to.emit(whisper, "EmailSent")
        .withArgs("alice", "alice");

      const inbox = await whisper.connect(alice).getInbox();
      expect(inbox[0].ipfsCID).to.equal("self-cid");
    });
/*
    it("Should prevent sending with invalid parameters", async function () {
      const { whisper, alice, bob } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser("alice", "pk1");
      await whisper.connect(bob).registerUser("bob", "pk2");

      await expect(whisper.connect(alice).sendEmail("", "bob", "cid"))
        .to.be.revertedWithCustomError(whisper, "NotOwnerOfSendingDomain");

      await expect(whisper.connect(alice).sendEmail("alice", "", "cid"))
        .to.be.revertedWithCustomError(whisper, "UserDoesNotExist");

      await expect(whisper.connect(alice).sendEmail("alice", "bob", ""))
        .to.be.not.reverted; // Assuming empty CID is allowed
    });*/
  });

  describe("Encryption Key Management", function () {
    it("Should allow key rotation for name owner", async function () {
      const { whisper, alice } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser("alice", "pk1");
      
      await whisper.connect(alice).updateEncryptionKey("pk2", "alice");
      const updatedKey = await whisper.getPublicKeyOf("alice");
      expect(updatedKey).to.equal("pk2");
    });

    it("Should prevent fetching keys for non-existent users", async function () {
      const { whisper } = await loadFixture(deployWhisperFixture);
      await expect(whisper.getPublicKeyOf("nonexistent"))
        .to.be.revertedWithCustomError(whisper, "UserDoesNotExist");
    });
  });

  describe("Inbox Management", function () {
    it("Should maintain separate inboxes for different users", async function () {
      const { whisper, alice, bob, charlie } = await loadFixture(deployWhisperFixture);
      // Setup
      await whisper.connect(alice).registerUser("alice", "pk1");
      await whisper.connect(bob).registerUser("bob", "pk2");
      await whisper.connect(charlie).registerUser("charlie", "pk3");

      // Send emails
      await whisper.connect(alice).sendEmail("alice", "bob", "cid1");
      await whisper.connect(alice).sendEmail("alice", "charlie", "cid2");

      // Verify counts
      expect((await whisper.connect(bob).getInbox()).length).to.equal(1);
      expect((await whisper.connect(charlie).getInbox()).length).to.equal(1);
      expect((await whisper.connect(alice).getInbox()).length).to.equal(0);
    });

    it("Should clear only the caller's inbox", async function () {
      const { whisper, alice, bob } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser("alice", "pk1");
      await whisper.connect(bob).registerUser("bob", "pk2");
      
      // Send mutual emails
      await whisper.connect(alice).sendEmail("alice", "bob", "cid1");
      await whisper.connect(bob).sendEmail("bob", "alice", "cid2");

      // Clear one inbox
      await whisper.connect(alice).clearInbox();

      // Verify
      expect((await whisper.connect(alice).getInbox()).length).to.equal(0);
      expect((await whisper.connect(bob).getInbox()).length).to.equal(1);
    });
  });

  describe("Pause Functionality", function () {
    it("Should block all user operations when paused", async function () {
      const { whisper, admin, alice } = await loadFixture(deployWhisperFixture);
      await whisper.connect(admin).pause();

      await expect(whisper.connect(alice).registerUser("alice", "pk1"))
        .to.be.reverted;

      await expect(whisper.connect(alice).getInbox())
        .to.be.reverted;
    });

    it("Should restore functionality after unpause", async function () {
      const { whisper, admin, alice } = await loadFixture(deployWhisperFixture);
      await whisper.connect(admin).pause();
      await whisper.connect(admin).unpause();

      await expect(whisper.connect(alice).registerUser("alice", "pk1"))
        .not.to.be.reverted;
    });
  });

  describe("Access Control", function () {
    it("Should prevent non-admins from pausing", async function () {
      const { whisper, alice } = await loadFixture(deployWhisperFixture);
      await expect(whisper.connect(alice).pause())
        .to.be.reverted;
    });

  
  });
});