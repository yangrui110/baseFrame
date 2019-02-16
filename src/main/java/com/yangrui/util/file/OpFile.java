package com.yangrui.util.file;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import com.yangrui.exception.BaseException;
import com.yangrui.exception.ExceptionEntity;

public class OpFile {

	public static byte[] readFileToByte(InputStream inputStream) throws IOException {
		BufferedInputStream inputStream1=new BufferedInputStream(inputStream);
		ByteArrayOutputStream outputStream=new ByteArrayOutputStream();
		byte[] bys=new byte[1024];
		while(inputStream1.read(bys)!=-1) {
			outputStream.write(bys,0,bys.length);
		}
		byte[] bs=outputStream.toByteArray();
		//文件字节数组
		outputStream.close();
		inputStream1.close();
		return bs;
	}
	/**
	 * 路径结合方式：path+name
	 * @throws IOException 
	 * */
	public static void writeToFile(String absolute,byte[] bys) throws IOException {
		File file=new File(absolute);
		if(!file.exists()) {
			file.createNewFile();
		}
		BufferedOutputStream out=new BufferedOutputStream(new FileOutputStream(file));
		out.write(bys);
		out.close();
	}
	/**
	 * @throws FileNotFoundException 
	 * @path 文件的绝对路径，例:C:\\AllData\\FileUpload\\
	 * */
	public static InputStream getFileInputStream(String path) throws FileNotFoundException {
		File file=new File(path);
		if(!file.exists())
			throw new BaseException(new ExceptionEntity(305,"资源不存在"));
		FileInputStream inputStream=new FileInputStream(file);
		return inputStream;
	}
}
