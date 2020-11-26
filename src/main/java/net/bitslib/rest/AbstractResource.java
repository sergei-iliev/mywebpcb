package net.bitslib.rest;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class AbstractResource {

	/*
	 * Add xml node to content root node
	 */
	public  String addNode(String content, String nodeName, String nodeValue) {
		StreamResult result = null;
		try {
			DocumentBuilderFactory docFactory = DocumentBuilderFactory
					.newInstance();
			DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
			InputSource is = new InputSource();
			is.setCharacterStream(new StringReader(content));
			Document doc = docBuilder.parse(is);

			Node root = doc.getDocumentElement();

			Node newElement = doc.createElement(nodeName);
			newElement.setTextContent(nodeValue);
			root.appendChild(newElement);

			Transformer transformer = TransformerFactory.newInstance()
					.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");

			result = new StreamResult(new StringWriter());
			DOMSource source = new DOMSource(doc);
			transformer.transform(source, result);
		} catch (ParserConfigurationException pce) {
			throw new IllegalStateException(pce);
		} catch (SAXException se) {
			throw new IllegalStateException(se);
		} catch (IOException ioe) {
			throw new IllegalStateException(ioe);
		} catch (TransformerConfigurationException tce) {
			throw new IllegalStateException(tce);
		} catch (TransformerException te) {
			throw new IllegalStateException(te);
		}

		return result.getWriter().toString();
	}
}
