import { Button, Link, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip } from "@heroui/react";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail, MdContentCopy } from "react-icons/md";
import { IoDocument } from "react-icons/io5";
import { useState } from "react";

function ContactButton() {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [copied, setCopied] = useState(false);
  const email = "daffaaditya.me@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <Button
        as={Link}
        href="https://www.linkedin.com/in/daffaadityarahman-14b588192/"
        target="_blank"
        startContent={<FaLinkedin className="text-xl" />}
        className="bg-default-100 hover:bg-default-200"
        size="lg"
      >
        LinkedIn
      </Button>

      <Button
        onPress={onOpen}
        startContent={<MdEmail className="text-xl" />}
        className="bg-default-100 hover:bg-default-200"
        size="lg"
      >
        Email
      </Button>

      <Button
        as={Link}
        href="https://drive.google.com/file/d/16bp1lgGaVHe670IO1bR7khk01h6GaXdC/view"
        target="_blank"
        startContent={<IoDocument className="text-xl" />}
        className="bg-default-100 hover:bg-default-200"
        size="lg"
      >
        Resume
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Contact via Email</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <p>You can reach me at:</p>
                  <div className="flex items-center gap-2 p-2 bg-default-100 rounded-lg">
                    <p className="grow font-medium">{email}</p>
                    <Tooltip
                      content={copied ? "Copied!" : "Copy to clipboard"}
                      placement="right"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleCopyEmail}
                      >
                        <MdContentCopy className={`text-xl ${copied ? "text-success" : ""}`} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  as={Link}
                  href={`mailto:${email}`}
                  color="primary"
                  target="_blank"
                  onPress={onClose}
                >
                  Open Email Client
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ContactButton;