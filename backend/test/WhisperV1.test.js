const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Whisper Contract", function () {
  async function deployWhisperFixture() {
    const [admin, alice, bob, charlie] = await ethers.getSigners();
    const Whisper = await ethers.getContractFactory("contracts/WhisperV1.sol:Whisper");
    const whisper = await Whisper.deploy();
    return { whisper, admin, alice, bob, charlie };
  }

  describe("User Registration", function () {
    
    it("Shouldn't allow multiple registrations", async function () {
      const { whisper, alice} = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser();
      
      await expect(whisper.connect(alice).registerUser())
        .to.be.revertedWithCustomError(whisper, "AlreadyHaveAnAccount");
      
      
    });

    
  });

  describe("Email Functionality", function () {
    it("Should store email in both sender's sent and recipient's inbox", async function () {
      const { whisper, alice, bob } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser();
      await whisper.connect(bob).registerUser();

      await whisper.connect(alice).sendEmail(bob,"cid123");

      const aliceSent = await whisper.connect(alice).getSent();
      const bobInbox = await whisper.connect(bob).getInbox();

      expect(aliceSent[0].ipfsCID).to.equal("cid123");
      expect(bobInbox[0].ipfsCID).to.equal("cid123");
    });

    /*
    it("Shouldn't allow sending to Zero address", async function () {
        const { whisper, alice} = await loadFixture(deployWhisperFixture);
        await whisper.connect(alice).registerUser();
        
        
         
        await expect(whisper.connect(alice).sendEmail(0x0000000000000000000000000000000000000000,"cid123"))
        .to.be.reverted;
        
      });*/


      it("Shouldn't allow sending when a user is not registered", async function () {
        const { whisper, alice,bob } = await loadFixture(deployWhisperFixture);
        await whisper.connect(bob).registerUser();
        await expect(whisper.connect(alice).sendEmail(bob,"self-cid"))
          .to.be.revertedWithCustomError(whisper,"UserDoNotExist");
        
      });

      it("Shouldn't allow rec  when a user is not registered", async function () {
        const { whisper, alice,bob } = await loadFixture(deployWhisperFixture);
        await whisper.connect(alice).registerUser();
        await expect(whisper.connect(alice).sendEmail(bob,"self-cid"))
          .to.be.revertedWithCustomError(whisper,"UserDoNotExist");
        
      });
    
    
    it("Should allow sending email to self", async function () {
      const { whisper, alice } = await loadFixture(deployWhisperFixture);
      await whisper.connect(alice).registerUser();

      await expect(whisper.connect(alice).sendEmail(alice,"self-cid"))
        .to.emit(whisper, "EmailSent")
        .withArgs(alice,alice);

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



  describe("Inbox Management", function () {
    it("Should maintain separate inboxes for different users", async function () {
      const { whisper, alice, bob, charlie } = await loadFixture(deployWhisperFixture);
      // Setup
      await whisper.connect(alice).registerUser();
      await whisper.connect(bob).registerUser();
      await whisper.connect(charlie).registerUser();

      // Send emails
      await whisper.connect(alice).sendEmail(bob, "cid1");
      await whisper.connect(alice).sendEmail(charlie, "cid2");

      // Verify counts
      expect((await whisper.connect(bob).getInbox()).length).to.equal(1);
      expect((await whisper.connect(charlie).getInbox()).length).to.equal(1);
      expect((await whisper.connect(alice).getInbox()).length).to.equal(0);
    });

    

  describe("Pause Functionality", function () {
    it("Should block all user operations when paused", async function () {
      const { whisper, admin, alice } = await loadFixture(deployWhisperFixture);
      await whisper.connect(admin).pause();

      await expect(whisper.connect(alice).registerUser())
        .to.be.reverted;

      await expect(whisper.connect(alice).getInbox())
        .to.be.reverted;
    });

    it("Should restore functionality after unpause", async function () {
      const { whisper, admin, alice } = await loadFixture(deployWhisperFixture);
      await whisper.connect(admin).pause();
      await whisper.connect(admin).unpause();

      await expect(whisper.connect(alice).registerUser())
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

});