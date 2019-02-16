package com.yangrui.config.basic.properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Configuration
@Component
public class MqConfig {
	@Value("${mq.serverIp}")
    private String serverIp;
	@Value("${mq.tcpPort}")
    private int tcpPort;
	@Value("${mq.mqttPort}")
    private int mqttPort;
	@Value("${mq.timeout}")
    private int timeout;
	@Value("${mq.timeoutSecond}")
    private int timeoutSecond;
	@Value("${mq.sUserName}")
    private String sUserName;
	@Value("${mq.sPassword}")
    private String sPassword;

	@Value("${mq.clientId}")
    private String clientId;

	public String getServerIp() {
		return serverIp;
	}

	public void setServerIp(String serverIp) {
		this.serverIp = serverIp;
	}

	public int getTcpPort() {
		return tcpPort;
	}

	public void setTcpPort(int tcpPort) {
		this.tcpPort = tcpPort;
	}

	public int getMqttPort() {
		return mqttPort;
	}

	public void setMqttPort(int mqttPort) {
		this.mqttPort = mqttPort;
	}

	public long getTimeout() {
		return timeout;
	}

	public void setTimeout(int timeout) {
		this.timeout = timeout;
	}

	public int getTimeoutSecond() {
		return timeoutSecond;
	}

	public void setTimeoutSecond(int timeoutSecond) {
		this.timeoutSecond = timeoutSecond;
	}

	public String getsUserName() {
		return sUserName;
	}

	public void setsUserName(String sUserName) {
		this.sUserName = sUserName;
	}

	public String getsPassword() {
		return sPassword;
	}

	public void setsPassword(String sPassword) {
		this.sPassword = sPassword;
	}

	public String getClientId() {
		return clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	@Override
	public String toString() {
		return "MqConfig [serverIp=" + serverIp + ", tcpPort=" + tcpPort + ", mqttPort=" + mqttPort + ", timeout="
				+ timeout + ", timeoutSecond=" + timeoutSecond + ", sUserName=" + sUserName + ", sPassword=" + sPassword
				+ ", clientId=" + clientId + "]";
	}
	
	
}
